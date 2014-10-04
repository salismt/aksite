'use strict';

var _ = require('lodash');
var Upload = require('./upload.model');
var config = require('../../config/environment');
var mongoose = require('mongoose');
var fs = require('fs');

var Schema = mongoose.Schema;
var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;

var gfs, model;

var conn = mongoose.createConnection(config.mongo.uri);
conn.once('open', function (err) {
    if (err) {
        handleError(err);
        return;
    }
    gfs = Grid(conn.db);
    model = conn.model('Upload', Schema);
});

// Get list of uploads
exports.index = function (req, res) {
    Upload.find(function (err, uploads) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(200, uploads);
    });
};

// Get a single upload
exports.show = function (req, res) {
    var readstream = gfs.createReadStream({
        _id: req.params.id
    });

    readstream.pipe(res);

//    Upload.findById(req.params.id, function (err, upload) {
//        if (err) {
//            return handleError(res, err);
//        } else if (!upload) {
//            return res.send(404);
//        } else {
//            return res.json(upload);
//        }
//    });
};

// Creates a new upload in the DB.
exports.create = function (req, res) {
    var writestream = gfs.createWriteStream({
        filename: 'yeoman.png'
    });
    fs.createReadStream('/Users/andrew.koroluk/aksite/data/yeoman.png').pipe(writestream);
    writestream.on('close', function (file) {

//        console.log(req.params.filename);
//        console.log(file);
//        console.log(file.filename);

        Upload.create(file, function (err, upload) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(201, upload);
        });
    });

//    return res.json(201);
};

// Updates an existing upload in the DB.
exports.update = function (req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    Upload.findById(req.params.id, function (err, upload) {
        if (err) {
            return handleError(res, err);
        } else if (!upload) {
            return res.send(404);
        } else {
            var updated = _.merge(upload, req.body);
            updated.save(function (err) {
                if (err) {
                    return handleError(res, err);
                }
                return res.json(200, upload);
            });
        }
    });
};

// Deletes a upload from the DB.
exports.destroy = function (req, res) {
    Upload.findById(req.params.id, function (err, upload) {
        if (err) {
            return handleError(res, err);
        }
        if (!upload) {
            return res.send(404);
        }
        upload.remove(function (err) {
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