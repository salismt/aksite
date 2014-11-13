'use strict';

var _ = require('lodash');
var Photo = require('./photo.model');
var config = require('../../config/environment');

function handleError(res, err) {
    return res.status(500).send(err);
}

// Get list of photos
exports.index = function(req, res) {
    Photo.find(function(err, photos) {
        if(err) return handleError(res, err);
        else return res.status(200).json(photos);
    });
};

// Get a single photo
exports.show = function(req, res) {
    Photo.findById(req.params.id, function(err, photo) {
        if(err) {
            return handleError(res, err);
        } else if(!photo) {
            return res.status(404).end();
        } else {
            return res.json(photo);
        }
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
