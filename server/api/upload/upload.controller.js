'use strict';

var _ = require('lodash');
var Upload = require('./upload.model');
var Photo = require('../photo/photo.model');
var config = require('../../config/environment');
var mongoose = require('mongoose');
var fs = require('fs');

var gridform = require('gridform');
gridform.mongo = mongoose.mongo;
var formidable = require('formidable');

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
    gridform.db = conn.db;
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
    var form = gridform({ db: conn.db, mongo: mongoose.mongo });
//    console.log(form);
//    if(!(form instanceof formidable.IncomingForm)) return res.send('error');


    // optionally store per-file metadata
    form.on('fileBegin', function (name, file) {
        file.metadata = 'test meta';
    });

    form.parse(req, function (err, fields, files) {

        // use files and fields as you do today
        var file = files.upload;

        console.log(err);
        console.log(files);
        console.log(fields);


//        file.name // the uploaded file name
//        file.type // file type per [mime](https://github.com/bentomas/node-mime)
//        file.size // uploaded file size (file length in GridFS) named "size" for compatibility
//        file.path // same as file.name. included for compatibility
//        file.lastModified // included for compatibility

        // files contain additional gridfs info
//        file.root // the root of the files collection used in MongoDB ('fs' here means the full collection in mongo is named 'fs.files')
//        file.id   // the ObjectId for this file

        return res.json(201);
    });

    /*if(!_.isNull(req.filename) && !_.isUndefined(req.filename)) {
        res.send(400);
        return;
    }

    var writestream = gfs.createWriteStream({
        filename: 'yeoman.png'
    });
    fs.createReadStream(req.body.filename).pipe(writestream);
    writestream.on('close', function (file) {

        console.log(req.body);
//        console.log(file);
//        console.log(file.filename);

        Upload.create(file, function (err, upload) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(201, upload);
        });
    });*/

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