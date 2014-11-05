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
    gridModel = mongoose.model("gridModel", gridSchema, "fs.files");

gridform.mongo = mongoose.mongo;
Grid.mongo = mongoose.mongo;

var gfs,
    conn = mongoose.createConnection(config.mongo.uri);
conn.once('open', function(err) {
    if(err) {
        handleError(err);
        return;
    }
    gfs = Grid(conn.db);
    gridform.db = conn.db;
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

    //console.log(form);

    // optionally store per-file metadata
    form.on('fileBegin', function(name, file) {
        file.metadata = {

        };

        console.log(name);
        //console.log(file);
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

        console.log(file);

        //console.log(files);
        console.log(fields);

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
                    var stream = gfs.createReadStream({_id: file.id});
                    stream.on('error', handleGridStreamErr(res));
                    var img = gm(stream, file.id);
                    img.resize(200, 200, "^");
                    img.crop(200, 200, 0, 0);
                    img.quality(90);
                    img.stream(function(err, outStream) {
                        if(err) return res.status(500).end();
                        else {
                            var writestream = gfs.createWriteStream({filename: file.name});
                            writestream.on('close', function(file) {
                                console.log(file);
                                photoModel.thumbnailId = file._id;

                                Photo.create(photoModel, function (err, photo) {
                                    if (err) return handleError(res, err);
                                    else return res.status(201).json(photo);
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
    return function (err) {
        if (/does not exist/.test(err)) {
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
