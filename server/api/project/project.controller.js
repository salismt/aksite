'use strict';

var _ = require('lodash'),
    Project = require('./project.model'),
    config = require('../../config/environment'),
    mongoose = require('mongoose'),
    fs = require('fs'),
    gridform = require('gridform'),
    gm = require('gm'),
    Schema = mongoose.Schema,
    Grid = require('gridfs-stream'),
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

// Get list of projects
exports.index = function(req, res) {
    Project.find(function(err, projects) {
        if(err) {
            return handleError(res, err);
        } else {
            return res.status(200).json(projects);
        }
    });
};

// Get a single project
exports.show = function(req, res) {
    if(!isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid ID');
    }
    Project.findById(req.params.id, function(err, project) {
        if(err) {
            return handleError(res, err);
        } else if(!project) {
            return res.status(404).end();
        } else {
            return res.json(project);
        }
    });
};

// Creates a new project in the DB.
exports.create = function(req, res) {
    var form = gridform({db: conn.db, mongo: mongoose.mongo});

    // optionally store per-file metadata
    //form.on('fileBegin', function(name, file) {
    //    file.metadata = {};
    //});

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
            return res.status(400).send('No file');

        //console.log(file);
        //console.log(fields);
        var sanitised = sanitiseNewProject(fields, file);

        if(sanitised === null) {
            var projectModel = {
                name: fields.name,
                info: fields.info,
                content: fields.content,
                date: fields.date || new Date(),
                coverId: file.id
            };
            if(fields.hidden === 'true') {
                projectModel.hidden = true;
            } else if(fields.hidden === 'false') {
                projectModel.hidden = false;
            } else { //sanitizer should prevent this
                projectModel.hidden = false;
            }

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
                        projectModel.thumbnailId = file._id;

                        Project.create(projectModel, function(err, project) {
                            if(err) return handleError(res, err);
                            else return res.status(201).json(project);
                        });
                    });
                    outStream.pipe(writestream);
                }
            });
        } else {
            return res.status(400).send(sanitised);
        }
    });
};

//TODO: Sanitize
// Updates an existing project in the DB.
exports.update = function(req, res) {
    if(!isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid ID');
    }
    var form = gridform({db: conn.db, mongo: mongoose.mongo});

    //console.log(form);

    // optionally store per-file metadata
    //form.on('fileBegin', function(name, file) {
    //    file.metadata = {};
    //});

    Project.findById(req.params.id, function(err, project) {
        if(err) {
            return handleError(res, err);
        } else if(!project) {
            return res.send(404);
        } else {
            form.parse(req, function(err, fields, files) {
                if(err) return handleError(res, err);

                if(fields._id) {
                    delete fields._id;
                }

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

                if(fields.newImage && (_.isNull(file) || _.isUndefined(file)) )
                    return res.status(400).send(new Error('No file'));

                console.log(file);
                console.log(fields);

                //TODO
                var sanitised = null;

                if(sanitised === null) {
                    var projectModel = {};
                    if(fields.name && typeof fields.name == 'string')
                        projectModel.name = fields.name;
                    if(fields.info && typeof fields.info == 'string')
                        projectModel.info = fields.info;
                    if(!_.isNull(fields.hidden) || !_.isUndefined(fields.hidden))
                        projectModel.hidden = fields.hidden ? true : false;
                    if(fields.content && typeof fields.content == 'string')
                        projectModel.content = fields.content;
                    if( fields.date && ( fields.date instanceof Date || isNaN(fields.date.valueOf()) ) )
                        projectModel.date = fields.date;

                    if(fields.newImage) {
                        gfs.remove({_id: project.coverId}, function (err) {
                            if (err) return handleError(err);
                            else console.log('deleted coverId');
                        });
                        gfs.remove({_id: project.thumbnailId}, function (err) {
                            if (err) return handleError(err);
                            else console.log('deleted thumbnailId');
                        });

                        projectModel.coverId = file.id;

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
                                    projectModel.thumbnailId = file._id;

                                    var updated = _.assign(project, projectModel);
                                    return updated.save(function(err) {
                                        if(err) {
                                            return handleError(res, err);
                                        } else {
                                            return res.status(200).json(project);
                                        }
                                    });
                                });
                                outStream.pipe(writestream);
                            }
                        });
                    } else {
                        var updated = _.assign(project, projectModel);
                        return updated.save(function(err) {
                            if(err) {
                                return handleError(res, err);
                            } else {
                                return res.status(200).json(project);
                            }
                        });
                    }
                } else {
                    return res.status(400).send(sanitised);
                }
            });
        }
    });
};

// Deletes a project from the DB.
exports.destroy = function(req, res) {
    if(!isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid ID');
    }
    Project.findById(req.params.id, function(err, project) {
        if(err) {
            return handleError(res, err);
        } else if(!project) {
            return res.send(404);
        } else {
            project.remove(function (err) {
                if (err) {
                    return handleError(res, err);
                }
                return res.send(204);
            });
        }
    });
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

function sanitiseNewProject(body, file) {
    // Required Params
    if(!body.name) {
        return 'Missing Name'
    } else if(!body.info) {
        return 'Missing info';
    } else if(!body.content) {
        return 'Missing content';
    } else if(!file) {
        return 'No cover image given';
    }
    // Type Checking
    else if(typeof body.name !== 'string') {
        return 'Name not String';
    } else if(typeof body.info !== 'string') {
        return 'Info not String';
    } else if(typeof body.content !== 'string') {
        return 'Content not String';
    } else if(body.date && ( !(body.date instanceof Date) || isNaN(body.date.valueOf()) )) {
        return 'Date not of type Date';
    } else if(body.hidden && (body.hidden !== 'true' && body.hidden !== 'false')) {
        return 'Hidden not Boolean';
    }
    //TODO: check image
    else {
        return null;
    }
}

function isValidObjectId(objectId) {
    return new RegExp("^[0-9a-fA-F]{24}$").test(objectId);
}
