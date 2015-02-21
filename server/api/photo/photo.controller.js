'use strict';

var _ = require('lodash'),
    Photo = require('./photo.model'),
    auth = require('../../auth/auth.service'),
    config = require('../../config/environment');

function handleError(res, err) {
    return res.status(500).send(err);
}

// Get list of photos
exports.index = function(req, res) {
    Photo.find(function(err, photos) {
        if(err) return handleError(res, err);
        else {
            if(!req.user || config.userRoles.indexOf(req.user.role) < config.userRoles.indexOf('admin')) {
                _.remove(photos, 'hidden');
            }
            return res.status(200).json(photos);
        }
    });
};

// Get a single photo
exports.show = function(req, res) {
    if(!isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid ID');
    }
    Photo.findById(req.params.id, function(err, photo) {
        if(err) {
            return handleError(res, err);
        } else if(!photo) {
            return res.status(404).end();
        } else {
            if( (!req.user || config.userRoles.indexOf(req.user.role) < config.userRoles.indexOf('admin')) && photo.hidden ) {
                return res.status(401).end();
            } else {
                return res.json(photo);
            }
        }
    });
};

// Get the number of photos
exports.count = function(req, res) {
    Photo.count({}, function(err, count) {
        if(err) handleError(res, err);
        else res.status(200).json(count);
    });
};

// Creates a new photo in the DB.
exports.create = function(req, res) {
    Photo.create(req.body, function(err, photo) {
        if(err) {
            return handleError(res, err);
        } else {
            return res.status(201).json(photo);
        }
    });
};

// Updates an existing photo in the DB.
exports.update = function(req, res) {
    if(!isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid ID');
    }
    if(req.body._id) {
        delete req.body._id;
    }
    Photo.findById(req.params.id, function(err, photo) {
        if(err) {
            return handleError(res, err);
        } else if(!photo) {
            return res.status(404).end();
        } else {
            var updated = _.merge(photo, req.body);
            updated.save(function(err) {
                if(err) {
                    return handleError(res, err);
                } else {
                    return res.status(200).json(photo);
                }
            });
        }
    });
};

// Deletes a photo from the DB.
exports.destroy = function(req, res) {
    if(!isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid ID');
    }
    Photo.findById(req.params.id, function(err, photo) {
        if(err) {
            return handleError(res, err);
        } else if(!photo) {
            return res.status(404).end();
        } else {
            photo.remove(function(err) {
                if(err) {
                    return handleError(res, err);
                } else {
                    return res.status(204).end();
                }
            });
        }
    });
};

function isValidObjectId(objectId) {
    return new RegExp("^[0-9a-fA-F]{24}$").test(objectId);
}
