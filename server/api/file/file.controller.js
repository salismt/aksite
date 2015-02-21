'use strict';

var _ = require('lodash'),
    config = require('../../config/environment'),
    mongoose = require('mongoose'),
    gridform = require('gridform'),
    File = require('./file.model'),
    Schema = mongoose.Schema,
    Grid = require('gridfs-stream'),
    gm = require('gm'),
    auth = require('../../auth/auth.service');

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
    File.find(function(err, files) {
        if(err) {
            return handleError(res, err);
        } else {
            if(!req.user || config.userRoles.indexOf(req.user.role) < config.userRoles.indexOf('admin')) {
                _.remove(files, 'hidden');
            }
            return res.status(200).json(files);
        }
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
            if( (!req.user || config.userRoles.indexOf(req.user.role) < config.userRoles.indexOf('admin')) /*&& file.hidden*/ ) {
                return res.status(401).end();
            } else {
                var readStream = gfs.createReadStream({
                    _id: req.params.id
                });

                readStream.pipe(res);
            }
        }
    });
};

// Get the number of files
exports.count = function(req, res) {
    File.count({}, function(err, count) {
        if(err) handleError(res, err);
        else res.status(200).json(count);
    });
};

// Creates a new file in the DB.
exports.create = function(req, res) {
    var form = gridform({db: conn.db, mongo: mongoose.mongo});

    //console.log(form);

    // optionally store per-file metadata
    form.on('fileBegin', function(name, file) {
        file.metadata = {};

        console.log(name);
        console.log(file);
    });

    form.parse(req, function(err, fields, files) {
        //if(err) return handleError(res, err);

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

        if(_.isNull(file))
            return res.status(400).send(new Error('No file'));

        console.log(file);

        console.log(fields);

        if(!_.isEmpty(fields)) {
            //TODO: Break this out into separate functions for code readability
            if(fields.name && typeof fields.name == 'string') {
                file.name = fields.name;
            }
            if(fields.purpose && typeof fields.purpose == 'string') {
                file.purpose = fields.purpose;
                if(fields.purpose.toLowerCase() === 'photo') {
                    // Model properties
                    var photoModel = {
                        name: file.name,
                        fileId: file.id
                    };
                    if(fields.info && typeof fields.info == 'string')
                        photoModel.info = fields.info;

                    // Thumbnail generation
                    var stream = gfs.createReadStream({_id: file._id});
                    stream.on('error', handleGridStreamErr(res));
                    var img = gm(stream, file.id);
                    img.size(function(err, size) {
                        if(size.width > size.height) {
                            img.shave((size.width - size.height) / 2, 0);
                        } else {
                            img.shave(0, (size.height - size.width) / 2);
                        }
                        img.scale(200, 200).quality(90);
                        img.stream(function(err, outStream) {
                            if(err) return res.status(500).end();
                            else {
                                var writestream = gfs.createWriteStream({});
                                outStream.pipe(writestream).on('close', function(file) {
                                    photoModel.thumbnailId = file.id;
                                });
                            }
                        });
                    });

                    // Create the Photo DB instance
                    Photo.create(photoModel, function(err, photo) {
                        if(err) return handleError(res, err);
                        else return res.status(201).json(photo);
                    });
                } else if(fields.purpose.toLowerCase() === 'image') {
                    res.status(400).send('Error: Server not setup to handle that request.');
                } else if(fields.purpose.toLowerCase() === 'data') {
                    res.status(400).send('Error: Server not setup to handle that request.');
                } else {
                    // unorganized file
                    var fileModel = {
                        fileId: file.id
                    };
                    File.create(fileModel, function(err, photo) {
                        if(err) return handleError(res, err);
                        else return res.status(201).json(photo);
                    });
                }
            }
        } else {
            return res.status(201).end();
        }

        //console.log(file.id);
    });
};

// Updates an existing file in the DB.
exports.update = function(req, res) {
    if(!isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid ID');
    }
    if(req.body._id) {
        delete req.body._id;
    }
    File.findById(req.params.id, function(err, file) {
        if(err) {
            return handleError(res, err);
        }
        if(!file) {
            return res.send(404);
        }
        var updated = _.merge(file, req.body);
        updated.save(function(err) {
            if(err) {
                return handleError(res, err);
            }
            return res.status(200).json(file);
        });
    });
};

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

function isValidObjectId(objectId) {
    return new RegExp("^[0-9a-fA-F]{24}$").test(objectId);
}
