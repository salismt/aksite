'use strict';

var _ = require('lodash');
var Photo = require('./photo.model');
var fs = require('fs');
var path = require('path');
var config = require('../../config/environment');

var rootDir = config.root;

// Get list of photos
exports.index = function (req, res) {
	Photo.find(function (err, photos) {
		if (err) {
			return handleError(res, err);
		}
		return res.json(200, photos);
	});
};

// Get a single photo
exports.show = function (req, res) {
	Photo.findById(req.params.id, function (err, photo) {
		if (err) {
			return handleError(res, err);
		}
		else if (!photo) {
			return res.send(404);
		} else {
            fs.readFile(path.join(rootDir, photo.sourceUri), function(err, data) {
//                console.log(err);
                console.log(data);
                res.send({
                    title: photo.name,
                    src: data.toString('base64')
                });
//                res.render('index', {
//                    title: photo.name,
//                    src: data.toString('base64')
//                })
            });

//            return res.json(photo);
        }
	});
};

// Creates a new photo in the DB.
exports.create = function (req, res) {
	Photo.create(req.body, function (err, photo) {
		if (err) {
			return handleError(res, err);
		}
		return res.json(201, photo);
	});
};

// Updates an existing photo in the DB.
exports.update = function (req, res) {
	if (req.body._id) {
		delete req.body._id;
	}
	Photo.findById(req.params.id, function (err, photo) {
		if (err) {
			return handleError(res, err);
		}
		if (!photo) {
			return res.send(404);
		}
		var updated = _.merge(photo, req.body);
		updated.save(function (err) {
			if (err) {
				return handleError(res, err);
			}
			return res.json(200, photo);
		});
	});
};

// Deletes a photo from the DB.
exports.destroy = function (req, res) {
	Photo.findById(req.params.id, function (err, photo) {
		if (err) {
			return handleError(res, err);
		}
		if (!photo) {
			return res.send(404);
		}
		photo.remove(function (err) {
			if (err) {
				return handleError(res, err);
			}
			return res.send(204);
		});
	});
};

function handleError(res, err) {
	return res.send(500, err);
}