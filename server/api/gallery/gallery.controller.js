'use strict';

var _ = require('lodash');
var Gallery = require('./gallery.model');
var Photo = require('../photo/photo.model');

// Get list of galleries
exports.index = function(req, res) {
    Gallery.find(function(err, galleries) {
        if(err) {
            return handleError(res, err);
        } else {
            return res.status(200).json(galleries);
        }
    });
};

// Get a single gallery
exports.show = function(req, res) {
    Gallery.findById(req.params.id, function(err, gallery) {
        if(err) {
            return handleError(res, err);
        } else if(!gallery) {
            return res.send(404);
        } else {
            return res.json(gallery);
        }
    });
};

// Creates a new gallery in the DB.
exports.create = function(req, res) {
    var sanitized = sanitiseNewGallery(req.body, req.params);
    if(sanitized !== null) {
        return res.status(400).send(sanitized);
    }
    var newGallery = {
        name: req.body.name,
        info: req.body.info,
        photos: req.body.photos
    };
    if(req.body.date) {

    }
    Gallery.create(newGallery, function(err, gallery) {
        if(err) {
            return handleError(res, err);
        } else {
            return res.status(201).json(gallery);
        }
    });
};

// Updates an existing gallery in the DB.
exports.update = function(req, res) {
    if(req.body._id) {
        delete req.body._id;
    }
    Gallery.findById(req.params.id, function(err, gallery) {
        if(err) {
            return handleError(res, err);
        } else if(!gallery) {
            return res.send(404);
        } else {
            var updated = _.merge(gallery, req.body);
            return updated.save(function(err) {
                if(err) {
                    return handleError(res, err);
                }
                return res.status(200).json(gallery);
            });
        }
    });
};

// Deletes a gallery from the DB.
exports.destroy = function(req, res) {
    Gallery.findById(req.params.id, function(err, gallery) {
        if(err) {
            return handleError(res, err);
        } else if(!gallery) {
            return res.send(404);
        } else {
            return gallery.remove(function(err) {
                if(err) {
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

function sanitiseNewGallery(body, params) {
    // Required Params
    if(!body.name) {
        return 'Missing Name'
    } else if(!body.info) {
        return 'Missing info';
    } else if(!body.photos) {
        return 'No photos given';
    }
    // Type Checking
    else if(typeof body.name !== 'string') {
        return 'Name not String';
    } else if(typeof body.info !== 'string') {
        return 'Info not String';
    } else if(body.date instanceof Date && !isNaN(body.date.valueOf())) {
        return 'Date not of type Date';
    } else if(body.active && typeof body.active !== 'boolean') {
        return 'Active not Boolean';
    } else if(!_.isArray(body.photos)) {
        return 'Photos not Array';
    }
    //TODO: sanitize each photo
    else {
        return null;
    }
}
