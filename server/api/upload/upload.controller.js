'use strict';

var _ = require('lodash'),
    q = require('q'),
    util = require('../../util'),
    path = require('path'),
    Photo = require('../photo/photo.model'),
    Project = require('../project/project.model'),
    User = require('../user/user.model'),
    FeaturedSection = require('../featured/featuredSection.model'),
    config = require('../../config/environment'),
    mongoose = require('mongoose'),
    fs = require('fs'),
    gridform = require('gridform'),
    ExifImage = require('exif').ExifImage,
    gm = require('gm'),
    Schema = mongoose.Schema,
    Grid = require('gridfs-stream'),
    gridSchema = new Schema({}, {strict: false}),
    gridModel = mongoose.model("gridModel", gridSchema, "fs.files"),
    gfs,
    conn = mongoose.createConnection(config.mongo.uri);

gridform.mongo = mongoose.mongo;
Grid.mongo = mongoose.mongo;

conn.once('open', function(err) {
    if(err) {
        util.handleError(err);
    } else {
        gfs = Grid(conn.db);
        gridform.db = conn.db;
    }
});

// Get list of files
exports.index = function(req, res) {
    gridModel.find({}, function(err, gridfiles) {
        if(err) util.handleError(res, err);
        else res.json(gridfiles);
    });
};

// Get a single file
exports.show = function(req, res) {
    if(req.params.id.substring(24) === '.jpg') {
        req.params.id = req.params.id.substring(0, 24);
    }
    if(!util.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid ID');
    }
    gfs.exist({_id: req.params.id}, function(err, found) {
        if(err) return util.handleError(err);
        else if(!found) return res.status(404).end();
        else {
            res.header('Content-Type', 'image/jpeg');
            gfs.createReadStream({ _id: req.params.id })
                .on('error', _.partial(util.handleError, res))
                .pipe(res);
        }
    });
};

// Get the number of uploads
exports.count = function(req, res) {
    gridModel.count({}, function(err, count) {
        if(err) util.handleError(res, err);
        else res.status(200).json(count);
    });
};

// Creates a new file in the DB.
exports.create = function(req, res) {
    var form = gridform({db: conn.db, mongo: mongoose.mongo});

    // optionally store per-file metadata
    form.on('fileBegin', function(name, file) {
        file.metadata = {};
    });

    form.parse(req, function(err, fields, files) {
        if(err) return util.handleError(res, err);

        /**
         * file.name            - the uploaded file name
         * file.type            - file type per [mime](https://github.com/bentomas/node-mime)
         * file.size            - uploaded file size (file length in GridFS) named "size" for compatibility
         * file.path            - same as file.name. included for compatibility
         * file.lastModified    - included for compatibility
         * file.root            - the root of the files collection used in MongoDB ('fs' here means the full collection in mongo is named 'fs.files')
         * file.id              - the ObjectId for this file
         * @type {file}
         */
        var file = files.file;

        if(_.isNull(file) || _.isUndefined(file))
            return res.status(400).send(new Error('No file'));

        console.log(file.name+' -> '+file.id);
        //console.log(fields);

        if(!_.isEmpty(fields)) {
            if(fields.name && typeof fields.name === 'string') {
                file.name = fields.name;
            }
            if(fields.purpose && typeof fields.purpose === 'string') {
                file.purpose = fields.purpose;

                if(fields.purpose.toLowerCase() === 'photo') {
                    var photoModel = {
                        name: file.name,
                        fileId: file.id
                    };
                    if(fields.info && typeof fields.purpose === 'string')
                        photoModel.info = fields.info;

                    var promises = [
                        getExif(file)
                            .then(function(exifData) {
                                photoModel.metadata = { exif: exifData.exif, image: exifData.image, gps: exifData.gps };
                                console.log(exifData);
                            }),
                        util.createThumbnail(file.id, {
                            width: null,
                            height: 400
                        })
                            .then(function(thumbnail) {
                                console.log(file.name+' -> (thumb)'+thumbnail.id);
                                photoModel.thumbnailId = thumbnail.id;
                                photoModel.width = thumbnail.originalWidth;
                                photoModel.height = thumbnail.originalHeight;
                            }),
                        util.createThumbnail(file.id)
                            .then(function(squareThumbnail) {
                                console.log(file.name+' -> (sqThumb)'+squareThumbnail.id);
                                photoModel.sqThumbnailId = squareThumbnail.id;
                            })
                    ];

                    q.all(promises)
                        .spread(function() {
                            Photo.create(photoModel, function(err, photo) {
                                if(err) return util.handleError(res, err);
                                else return res.status(201).json(photo);
                            });
                        }, res.status(400).send);
                }
            }
        } else {
            return res.status(400).end();
        }
    });
};

// Updates an existing file in the DB.
//exports.update = function(req, res) {
//    if(!isValidObjectId(req.params.id)) {
//        return res.status(400).send('Invalid ID');
//    }
//    if(req.body._id) {
//        delete req.body._id;
//    }
//    Upload.findById(req.params.id, function(err, upload) {
//        if(err) {
//            return util.handleError(res, err);
//        } else if(!upload) {
//            return res.send(404);
//        } else {
//            var updated = _.merge(upload, req.body);
//            updated.save(function(err) {
//                if(err) {
//                    return util.handleError(res, err);
//                }
//                return res.json(200, upload);
//            });
//        }
//    });
//};

// Deletes a file from the DB.
exports.destroy = function(req, res) {
    if(!util.isValidObjectId(req.params.id))
        return res.status(400).send('Invalid ID');
    if(!req.params.id)
        return res.status(404).send(new ReferenceError('File not found.'));
    else
        gfs.remove({_id: req.params.id}, function(err) {
            if(err) return util.handleError(err);
            res.status(200).end();
        });
};

// Finds and cleans orphaned GridFS files
exports.clean = function(req, res) {
    getFileIds()
        .then(function(fileIds) {
            q.allSettled([getPhotoIds(), getProjectIds(), getUserIds(), getFeaturedSectionIds()])
                .then(function(results) {
                    var usedIds = _.pluck(results, 'value');
                    usedIds = _.union(usedIds[0], usedIds[1], usedIds[2], usedIds[3]);
                    usedIds = _.invoke(usedIds, 'toString');

                    fileIds = _.invoke(fileIds, 'toString');

                    _.forEach(fileIds, function(id) {
                        if(!_.contains(usedIds, id)) {
                            console.log('Delete '+id);
                            gfs.remove({_id: id}, function(err) {
                                if(err) return util.handleError(err);
                            });
                        }
                    });
                });
        });
};

exports.makeLinks = function(req, res) {
    Photo.find().stream()
        .on('data', function (doc) {
            //console.log(doc);
            if(!doc.metadata)
                doc.metadata = {};
            if(doc.fileId) {

            }
        })
        .on('error', console.log)
        .on('close', function () {
            console.log('done');
        });
};

function handleGridStreamErr(res) {
    return function(err) {
        if(/does not exist/.test(err)) {
            // trigger 404
            console.log(err);
            return err;
        }

        // may have written data already
        res.status(500).end();
        console.error(err.stack);
    };
}

function getSize(fileId) {
    var deferred = q.defer();

    (function next() {
        var stream = gfs.createReadStream({_id: fileId});
        stream.on('error', console.log);
        var img = gm(stream, fileId);
        img.size(function(err, size) {
            if(err) return err;
            else if(_.isUndefined(size)) return 'Error: size undefined';
            else {
                deferred.resolve(size);
            }
        });
    })();

    return deferred.promise;
}

function isValidObjectId(objectId) {
    return new RegExp("^[0-9a-fA-F]{24}$").test(objectId);
}

function getExif(file) {
    var deferred = q.defer();

    gm(gfs.createReadStream({_id: file.id}).on('error', console.log), file.id)
        .toBuffer('JPG', function(err, buffer) {
            new ExifImage({ image: buffer }, function (error, exifData) {
                if (error)
                    deferred.reject(error);
                else
                    deferred.resolve(exifData);
            });
        });

    return deferred.promise;
}

function getPhotoIds() {
    var deferred = q.defer();

    Photo.find({}, function(err, photos) {
        if(err) deferred.reject(err);
        else deferred.resolve(_.union( _.pluck(photos, 'fileId'), _.pluck(photos, 'thumbnailId'), _.pluck(photos, 'sqThumbnailId') ));
    });

    return deferred.promise;
}

function getUserIds() {
    var deferred = q.defer();

    User.find({}, function(err, users) {
        if(err) deferred.reject(err);
        else deferred.resolve(_.union( _.pluck(users, 'imageId'), _.pluck(users, 'smallImageId') ));
    });

    return deferred.promise;
}

function getProjectIds() {
    var deferred = q.defer();

    Project.find({}, function(err, projects) {
        if(err) deferred.reject(err);
        else deferred.resolve(_.union( _.pluck(projects, 'thumbnailId'), _.pluck(projects, 'coverId') ));
    });

    return deferred.promise;
}

function getFeaturedSectionIds() {
    var deferred = q.defer();

    FeaturedSection.find({}, function(err, featuredSections) {
        if(err) deferred.reject(err);
        else deferred.resolve(_.pluck(featuredSections, 'fileId'));
    });

    return deferred.promise;
}

function getFileIds() {
    var deferred = q.defer();

    gridModel.find({}, function(err, gridfiles) {
        if(err) deferred.reject(err);
        else deferred.resolve(_.pluck(gridfiles, '_id'));
    });

    return deferred.promise;
}
