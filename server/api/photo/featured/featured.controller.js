'use strict';

var _           = require('lodash'),
    Featured    = require('./featured.model.js'),
    path        = require('path'),
    config      = require('../../../config/environment'),
    gm          = require('gm');

// Get list of featureds
exports.index = function(req, res) {
    var images = [
        path.resolve(config.root + '/data' + '/IMG_4149.JPG'),
        path.resolve(config.root + '/data' + '/IMG_4150.JPG')
    ];
    var gmstate = gm(images[0]);
    for (var i = 1; i < images.length; i++) gmstate.append(images[i]);

    console.log(gmstate);

    // finally write out the file asynchronously
    gmstate.write(path.resolve(config.root + '/data' + '/featured.jpg'), function (err) {
        if (!err) console.log('Hooray!');
        else console.log(err);
    });
    Featured.find(function(err, featureds) {
        if(err) return handleError(res, err);

        console.log(featureds);

        return res.status(200).json(featureds[0]);
    });
};

// Get a single featured
//exports.show = function(req, res) {
//    Featured.findById(req.params.id, function(err, featured) {
//        if(err) {
//            return handleError(res, err);
//        }
//        if(!featured) {
//            return res.send(404);
//        }
//        return res.json(featured);
//    });
//};

// Creates a new featured in the DB.
exports.create = function(req, res) {

    Featured.create(req.body, function(err, featured) {
        if(err) {
            return handleError(res, err);
        }
        return res.json(201, featured);
    });
};

// Updates an existing featured in the DB.
exports.update = function(req, res) {
    if(req.body._id) {
        delete req.body._id;
    }
    Featured.findById(req.params.id, function(err, featured) {
        if(err) {
            return handleError(res, err);
        }
        if(!featured) {
            return res.send(404);
        }
        var updated = _.merge(featured, req.body);
        updated.save(function(err) {
            if(err) {
                return handleError(res, err);
            }
            return res.json(200, featured);
        });
    });
};

// Deletes a featured from the DB.
//exports.destroy = function(req, res) {
//    Featured.findById(req.params.id, function(err, featured) {
//        if(err) {
//            return handleError(res, err);
//        }
//        if(!featured) {
//            return res.send(404);
//        }
//        featured.remove(function(err) {
//            if(err) {
//                return handleError(res, err);
//            }
//            return res.send(204);
//        });
//    });
//};

function handleError(res, err) {
    return res.send(500, err);
}
