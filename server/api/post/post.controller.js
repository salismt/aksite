'use strict';

var _ = require('lodash'),
    Post = require('./post.model'),
    auth = require('../../auth/auth.service'),
    config = require('../../config/environment');

var DEFAULT_PAGESIZE = 10;

// Get list of posts
exports.index = function(req, res) {
    Post.find()
        .limit(DEFAULT_PAGESIZE)
        .exec(function(err, posts) {
        if(err) {
            return handleError(res, err);
        }
        if(!req.user || config.userRoles.indexOf(req.user.role) < config.userRoles.indexOf('admin')) {
            _.remove(posts, 'hidden');
        }
        return res.status(200).json(posts);
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
    Post.create(req.body, function(err, post) {
        if(err) {
            return handleError(res, err);
        } else {
            return res.status(201).json(post);
        }
    });
};

// Updates an existing post in the DB.
exports.update = function(req, res) {
    if(!isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid ID');
    }
    if(req.body._id) {
        delete req.body._id;
    }
    Post.findById(req.params.id, function(err, post) {
        if(err) {
            return handleError(res, err);
        }
        if(!post) {
            return res.status(404).end();
        }
        var updated = _.merge(post, req.body);
        updated.save(function(err) {
            if(err) {
                return handleError(res, err);
            }
            return res.status(200).json(post);
        });
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

function isValidObjectId(objectId) {
    return new RegExp("^[0-9a-fA-F]{24}$").test(objectId);
}
