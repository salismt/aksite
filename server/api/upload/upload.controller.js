'use strict';

var _ = require('lodash'),
    Q = require('q'),
    path = require('path'),
    Photo = require('../photo/photo.model'),
    config = require('../../config/environment'),
    mongoose = require('mongoose'),
    fs = require('fs'),
    gridform = require('gridform'),
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
        handleError(err);
    } else {
        gfs = Grid(conn.db);
        gridform.db = conn.db;
    }
});

// Get list of files
exports.index = function(req, res) {
    gridModel.find({}, function(err, gridfiles) {
        if(err) handleError(res, err);
        else res.json(gridfiles);
    });
};

// Get a single file
exports.show = function(req, res) {
    if(!isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid ID');
    }
    gfs.exist({_id: req.params.id}, function(err, found) {
        if(err) return handleError(err);
        else if(!found) return res.status(404).end();
        else {
            var readStream = gfs.createReadStream({
                _id: req.params.id
            });

            readStream.pipe(res);
        }
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
        if(err) return handleError(res, err);

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
            if(fields.name && typeof fields.name == 'string') {
                file.name = fields.name;
            }
            if(fields.purpose && typeof fields.purpose == 'string') {
                file.purpose = fields.purpose;

                if(fields.purpose.toLowerCase() === 'photo') {
                    var photoModel = {
                        name: file.name,
                        fileId: file.id
                    };
                    if(fields.info && typeof fields.purpose == 'string')
                        photoModel.info = fields.info;

                    // Thumbnail generation
                    var thumbStream = gfs.createReadStream({_id: file.id});
                    thumbStream.on('error', handleGridStreamErr(res));
                    var thumb = gm(thumbStream, file.id);
                    thumb.resize(null, 400);
                    thumb.quality(90);
                    thumb.stream(function(err, outStream) {
                        if(err) return res.status(500).end();
                        else {
                            var writestream = gfs.createWriteStream({filename: file.name});
                            writestream.on('close', function(thumbFile) {
                                console.log(file.name+' -> (thumb)'+thumbFile._id);
                                photoModel.thumbnailId = thumbFile._id;

                                var sqThumbstream = gfs.createReadStream({_id: thumbFile.id});
                                sqThumbstream.on('error', handleGridStreamErr(res));
                                var sqThumb = gm(sqThumbstream, thumbFile.id);
                                sqThumb.resize(200, 200, "^");
                                sqThumb.crop(200, 200, 0, 0);
                                sqThumb.quality(90);
                                sqThumb.stream(function(err, outStream) {
                                    if(err) return res.status(500).end();
                                    else {
                                        var writestream = gfs.createWriteStream({filename: thumbFile.name});
                                        writestream.on('close', function(sqThumbFile) {
                                            console.log(file.name+' -> (sqThumb)'+sqThumbFile._id);
                                            photoModel.sqThumbnailId = sqThumbFile._id;

                                            Photo.create(photoModel, function(err, photo) {
                                                if(err) return handleError(res, err);
                                                else return res.status(201).json(photo);
                                            });
                                        });
                                        outStream.pipe(writestream);
                                    }
                                });
                            });
                            outStream.pipe(writestream);
                        }
                    });
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
//            return handleError(res, err);
//        } else if(!upload) {
//            return res.send(404);
//        } else {
//            var updated = _.merge(upload, req.body);
//            updated.save(function(err) {
//                if(err) {
//                    return handleError(res, err);
//                }
//                return res.json(200, upload);
//            });
//        }
//    });
//};

// Deletes a file from the DB.
exports.destroy = function(req, res) {
    if(!isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid ID');
    }
    if(!req.params.id)
        res.status(404).send(new ReferenceError('File not found.'));
    else {
        gfs.remove({_id: req.params.id}, function(err) {
            if(err) return handleError(err);
            res.status(200).end();
        });
    }
};

function handleError(res, err) {
    return res.status(500).send(err);
}

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
    var deferred = Q.defer();

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
