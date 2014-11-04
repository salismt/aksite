'use strict';

var _ = require('lodash');
var Gallery = require('./gallery.model');
var Photo = require('../photo/photo.model');

// Get list of galleries
exports.index = function (req, res) {
    Gallery.find(function (err, galleries) {
        if (err) {
            return handleError(res, err);
        } else {
            return res.status(200).json(galleries);
        }
    });
};

// Get a single gallery
exports.show = function (req, res) {
    Gallery.findById(req.params.id, function (err, gallery) {
        if (err) {
            return handleError(res, err);
        } else if (!gallery) {
            return res.send(404);
        } else {
            return res.json(gallery);
        }
    });
};

// Creates a new gallery in the DB.
exports.create = function (req, res) {
    Gallery.create(req.body, function (err, gallery) {
        if (err) {
            return handleError(res, err);
        } else {
            return res.status(201).json(gallery);
        }
    });
};

// Updates an existing gallery in the DB.
exports.update = function (req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    Gallery.findById(req.params.id, function (err, gallery) {
        if (err) {
            return handleError(res, err);
        } else if (!gallery) {
            return res.send(404);
        } else {
            var updated = _.merge(gallery, req.body);
            return updated.save(function (err) {
                if (err) {
                    return handleError(res, err);
                }
                return res.status(200).json(gallery);
            });
        }
    });
};

// Deletes a gallery from the DB.
exports.destroy = function (req, res) {
    Gallery.findById(req.params.id, function (err, gallery) {
        if (err) {
            return handleError(res, err);
        } else if (!gallery) {
            return res.send(404);
        } else {
            return gallery.remove(function (err) {
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
