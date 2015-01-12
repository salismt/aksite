'use strict';

var _ = require('lodash'),
    Post = require('./post.model'),
    auth = require('../../auth/auth.service'),
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

var DEFAULT_PAGESIZE = 10;
var MAX_PAGESIZE = 25;

// Get list of posts
exports.index = function(req, res) {
    if(req.query.page && req.query.page < 1) return res.status(400).send('Invalid page');

    var pageSize = (req.query.pagesize && req.query.pagesize <= MAX_PAGESIZE && req.query.pagesize > 0) ? req.query.pagesize : DEFAULT_PAGESIZE;
    var page = parseInt(req.query.page) || 0;

    Post.count({}, function(err, count) {
        if(err) return handleError(res, err);
        Post.find()
            .limit(pageSize)
            .sort('date')
            .skip((req.query.page-1) * pageSize || 0)//doesn't scale well, I'll worry about it later
            .exec(function(err, posts) {
                if(err) return handleError(res, err);
                if(!req.user || config.userRoles.indexOf(req.user.role) < config.userRoles.indexOf('admin')) {
                    _.remove(posts, 'hidden');
                }
                return res.status(200).json({
                    page: page,
                    pages: Math.ceil(count / pageSize),
                    items: posts,
                    numItems: count
                });
            });
    });
};

// Get a single post
exports.show = function(req, res) {
    if(!isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid ID');
    }
    Post.findById(req.params.id, function(err, post) {
        if(err) {
            return handleError(res, err);
        } else if(!post) {
            return res.status(404).end();
        } else {
            if( (!req.user || config.userRoles.indexOf(req.user.role) < config.userRoles.indexOf('admin')) && post.hidden ) {
                return res.status(401).end();
            } else {
                return res.json(post);
            }
        }
    });
};

// Creates a new post in the DB.
exports.create = function(req, res) {
    if(config.userRoles.indexOf(req.user.role) < config.userRoles.indexOf('admin')) {
        return res.status(401).send('You need to be an admin to create posts');
    }

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

        //console.log(file);
        //console.log(fields);
        var sanitised = sanitiseNewPost(fields);

        if(sanitised === null) {
            var postModel = {
                title: fields.title,
                subheader: fields.subheader,
                content: fields.content,
                date: new Date(fields.date) || new Date(),
                author: req.user._id,
                imageId: undefined,
                alias: fields.alias || undefined,
                categories: fields.categories || []
            };
            if(fields.hidden === 'true') {
                postModel.hidden = true;
            } else if(fields.hidden === 'false') {
                postModel.hidden = false;
            } else { //sanitizer should prevent this
                postModel.hidden = false;
            }

            if(file) {
                postModel.imageId = file.id;

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
                            postModel.thumbnailId = file._id;

                            Post.create(postModel, function(err, post) {
                                if(err) return handleError(res, err);
                                else return res.status(201).json(post);
                            });
                        });
                        outStream.pipe(writestream);
                    }
                });
            } else {
                Post.create(postModel, function(err, post) {
                    if(err) return handleError(res, err);
                    else return res.status(201).json(post);
                });
            }
        } else {
            return res.status(400).send(sanitised);
        }
    });
};

// Updates an existing post in the DB.
exports.update = function(req, res) {
    if(config.userRoles.indexOf(req.user.role) < config.userRoles.indexOf('admin')) {
        return res.status(401).send('You need to be an admin to create posts');
    }
    if(!isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid ID');
    }
    var form = gridform({db: conn.db, mongo: mongoose.mongo});

    Post.findById(req.params.id, function(err, post) {
        if(err) {
            return handleError(res, err);
        } else if(!post) {
            return res.status(404).end();
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

                if(sanitised !== null) {
                    return res.status(400).send(sanitised);
                } else {
                    var postModel = {};
                    if(fields.title && typeof fields.title == 'string')
                        postModel.title = fields.title;
                    if(fields.subheader && typeof fields.subheader == 'string')
                        postModel.subheader = fields.subheader;
                    if(fields.alias && typeof fields.alias == 'string')
                        postModel.alias = fields.alias;
                    if(!_.isNull(fields.hidden) || !_.isUndefined(fields.hidden))
                        postModel.hidden = fields.hidden ? true : false;
                    if(fields.content && typeof fields.content == 'string')
                        postModel.content = fields.content;
                    if(fields.categories)
                        postModel.categories = fields.categories;
                    if(fields.date)
                        postModel.date = new Date(fields.date);

                    if(fields.newImage) {
                        if(post.imageId) {
                            gfs.remove({_id: post.imageId}, function (err) {
                                if (err) return handleError(err);
                                else console.log('deleted imageId');
                            });
                            gfs.remove({_id: post.thumbnailId}, function (err) {
                                if (err) return handleError(err);
                                else console.log('deleted thumbnailId');
                            });
                        }

                        postModel.imageId = file.id;

                        // Thumbnail generation
                        var stream = gfs.createReadStream({_id: file.id});
                        stream.on('error', handleGridStreamErr(res));
                        gm(stream, file.id)
                            .resize(200, 200, "^")
                            .crop(200, 200, 0, 0)
                            .quality(90)
                            .stream(function(err, outStream) {
                                if(err) return res.status(500).end();
                                else {
                                    var writestream = gfs.createWriteStream({filename: file.name});
                                    writestream.on('close', function(file) {
                                        console.log(file);
                                        postModel.thumbnailId = file._id;

                                        var updated = _.assign(post, postModel);
                                        return updated.save(function(err) {
                                            if(err) {
                                                return handleError(res, err);
                                            } else {
                                                return res.status(200).json(post);
                                            }
                                        });
                                    });
                                    outStream.pipe(writestream);
                                }
                            });
                        // Thumbnail generation
                        var thumbStream = gfs.createReadStream({_id: file.id});
                        thumbStream.on('error', handleGridStreamErr(res));
                        gm(thumbStream, file.id)
                            .size({bufferStream: true}, function(err, size) {
                                photoModel.width = size.width;
                                photoModel.height = size.height;
                                console.log(size);
                                this.resize(null, 400);
                                this.quality(90);
                                this.stream(function(err, outStream) {
                                    if(err) res.status(500).end();
                                    else {
                                        var writestream = gfs.createWriteStream({filename: file.name});
                                        writestream.on('close', function(thumbFile) {
                                            console.log(file.name+' -> (thumb)'+thumbFile._id);
                                            photoModel.thumbnailId = thumbFile._id;

                                            Photo.create(photoModel, function(err, photo) {
                                                if(err) return handleError(res, err);
                                                else return res.status(201).json(photo);
                                            });
                                        });
                                        outStream.pipe(writestream);
                                    }
                                });
                            });
                    } else {
                        var updated = _.assign(post, postModel);
                        return updated.save(function(err) {
                            if(err) {
                                return handleError(res, err);
                            } else {
                                return res.status(200).json(post);
                            }
                        });
                    }
                }
            });
        }
    });
};

// Deletes a post from the DB.
exports.destroy = function(req, res) {
    if(!isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid ID');
    }
    Post.findById(req.params.id, function(err, post) {
        if(err) {
            return handleError(res, err);
        }
        if(!post) {
            return res.send(404);
        }
        post.remove(function(err) {
            if(err) {
                return handleError(res, err);
            }
            return res.send(204);
        });
    });
};

function handleError(res, err) {
    return res.send(500, err);
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

//TODO
function sanitiseNewPost(body) {
    // Required Params
    if(!body.title) {
        return 'Missing title'
    } else if(!body.subheader) {
        return 'Missing subheader';
    } else if(!body.content) {
        return 'Missing content';
    }
    // Type Checking
    else if(typeof body.title !== 'string') {
        return 'Title not String';
    } else if(typeof body.subheader !== 'string') {
        return 'Subheader not String';
    } else if(typeof body.content !== 'string') {
        return 'Content not String';
    } else if(body.hidden && (body.hidden !== 'true' && body.hidden !== 'false')) {
        return 'Hidden not Boolean';
    }
    //TODO: check image, etc
    else {
        return null;
    }
}

function isValidObjectId(objectId) {
    return new RegExp("^[0-9a-fA-F]{24}$").test(objectId);
}
