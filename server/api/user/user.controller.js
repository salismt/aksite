'use strict';

var _ = require('lodash'),
    util = require('../../util'),
    User = require('./user.model'),
    passport = require('passport'),
    config = require('../../config/environment'),
    jwt = require('jsonwebtoken'),
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
        util.handleError(err);
    } else {
        gfs = Grid(conn.db);
        gridform.db = conn.db;
    }
});

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
    User.find({}, '-salt -hashedPassword', function(err, users) {
        if(err) return util.handleError(res, err);
        res.status(200).json(users);
    });
};

// Get the number of users
exports.count = function(req, res) {
    User.count({}, function(err, count) {
        if(err) util.handleError(res, err);
        else res.status(200).json(count);
    });
};

/**
 * Creates a new user
 */
exports.create = function(req, res, next) {
    var newUser = new User(req.body);
    newUser.provider = 'local';
    newUser.providers.local = true;
    newUser.role = 'user';

    util.saveFileFromFs(config.root + config.client + '/assets/images/default_user.jpg', { filename: 'default_user.jpg' })
        .then(userImgFile => {
            newUser.imageId = userImgFile._id;
            newUser.save(function(err, user) {
                if(err) return util.handleError(res, err);
                var token = jwt.sign({_id: user._id}, config.secrets.session, {expiresInMinutes: 60 * 5});
                res.json({token: token});
            });
        });
};

/** Update a user */
exports.update = function(req, res) {
    if(!util.isValidObjectId(req.params.id))
        return res.status(400).send('Invalid ID');
    var form = gridform({db: conn.db, mongo: mongoose.mongo});

    User.findById(req.params.id, function(err, user) {
        if(err) {
            return util.handleError(res, err);
        } else if(!user) {
            return res.status(404).end();
        } else {
            form.parse(req, function(err, fields, files) {
                if(err) return util.handleError(res, err);

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

                if((fields.newImage || !user.imageId) && (_.isNull(file) || _.isUndefined(file)) )
                    return res.status(400).send(new Error('No file'));

                console.log(file);
                console.log(fields);

                //TODO
                var sanitised = null;

                if(sanitised !== null) {
                    return res.status(400).send(sanitised);
                } else {
                    var userModel = {};
                    if(fields.name && typeof fields.name == 'string')
                        userModel.name = fields.name;
                    if(fields.email && typeof fields.email == 'string')
                        userModel.email = fields.email;
                    if(fields.role && typeof fields.role == 'string')
                        userModel.role = fields.role;

                    if(fields.newImage || (!user.imageId && file)) {
                        if(user.imageId) {
                            gfs.remove({_id: user.imageId}, function (err) {
                                if (err) return util.handleError(err);
                                else console.log('deleted imageId');
                            });
                            gfs.remove({_id: user.smallImageId}, function (err) {
                                if (err) return util.handleError(err);
                                else console.log('deleted smallImageId');
                            });
                        }

                        userModel.imageId = file.id;

                        util.createThumbnail(file.id)
                            .catch(util.handleError)
                            .then(function(thumbnail) {
                                console.log(file.name+' -> (thumb)'+thumbnail.id);
                                userModel.smallImageId = thumbnail.id;

                                var updated = _.assign(user, userModel);
                                return updated.save(function(err) {
                                    if(err) return util.handleError(res, err);
                                    else return res.status(200).json(user);
                                });
                            });
                    } else {
                        var updated = _.assign(user, userModel);
                        return updated.save(function(err) {
                            if(err) {
                                return util.handleError(res, err);
                            } else {
                                return res.status(200).json(user);
                            }
                        });
                    }
                }
            });
        }
    });
};

/**
 * Get a single user
 */
exports.show = function(req, res, next) {
    var userId = req.params.id;

    console.log(req.user);

    User.findById(userId, function(err, user) {
        if(err) return next(err);
        if(!user) return res.status(404).end();

        console.log(user);
        if(req.user && config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf('admin')) {
            delete user.hashedPassword;
            delete user.salt;
            return res.json(user);
        } else {
            return res.json(user.profile);
        }
    });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
    User.findByIdAndRemove(req.params.id, function(err, user) {
        if(err) return res.send(500, err);
        return res.send(204);
    });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
    var userId = req.user._id;
    var oldPass = String(req.body.oldPassword);
    var newPass = String(req.body.newPassword);

    if(!req.user || req.user._id != userId) return res.status(401).end();

    User.findById(userId, function(err, user) {
        if(user.authenticate(oldPass)) {
            user.password = newPass;
            user.save(function(err) {
                if(err) return util.handleError(res, err);
                res.send(200);
            });
        } else {
            res.send(403);
        }
    });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
    var userId = req.user._id;
    User.findOne({
        _id: userId
    }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
        if(err) return next(err);
        if(!user) return res.json(404);
        res.json(user);
    });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
    res.redirect('/');
};
