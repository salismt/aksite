'use strict';

var _ = require('lodash');
var Upload = require('./upload.model');
var mongoose = require('mongoose')
//var mongo = require('mongodb');
var GridStore = mongoose.mongo.GridStore;
var Grid = mongoose.mongo.Grid;
var ObjectID = mongoose.mongo.BSONPure.ObjectID;
var GridStream = require('gridfs-stream');
GridStream.mongo = mongoose.mongo;

var conn = mongoose.createConnection();
var gfs;
conn.once('open', function() {
    gfs = GridStream(conn.db);
});


// Get list of uploads
exports.index = function(req, res) {
  Upload.find(function (err, uploads) {
    if(err) { return handleError(res, err); }
    return res.json(200, uploads);
  });
};

// Get a single upload
exports.show = function(req, res) {
  Upload.findById(req.params.id, function (err, upload) {
    if(err) { return handleError(res, err); }
    if(!upload) { return res.send(404); }
    return res.json(upload);
  });
};

exports.putFile = function(path, name, options, fn) {
    var db = mongoose.connection.db;
    options = parse(options);
    options.metadata.filename = name;
    var gs = new GridStore(db, name, "w", options);
    gs.open = function(err, file) {
        if(err) return fn(err);
        else return file.writeFile(path, fn);
    }
};

// Creates a new upload in the DB.
exports.create = function(req, res) {
    Upload.create(req.body, function(err, upload) {
        if(err) { return handleError(res, err); }
        return res.json(201, upload);
    });



//    req.pipe(GridStream.createWriteStream({
//        filename: 'test'
//    }));
//    res.send('success!');

//    var gs = new GridStore(this.db, filename, "w", {
//        "chunk_size": 1024*4,
//        metadata: {
//            hashpath: gridfs_name,
//            hash: hash,
//            name: name
//        }
//    });
//
//    gs.open(function(err,store) {
//        // Write data and automatically close on finished write
//        gs.writeBuffer(data, true, function(err,chunk) {
//            // Each file has an md5 in the file structure
//            cb(err,hash,chunk);
//            gs.close();
//        });
//    });
//
//
//
//    var data = _.pick(req.body, 'type')
//        , uploadPath = path.normalize(config.uploadDir + '/uploads')
//        , file = req.files.file;
//
//    console.log(file.name); //original name (ie: sunset.png)
//    console.log(file.path); //tmp path (ie: /tmp/12345-xyaz.png)
//    console.log(uploadPath); //uploads directory: (ie: /home/user/data/uploads)
//
};

// Updates an existing upload in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Upload.findById(req.params.id, function (err, upload) {
    if (err) { return handleError(res, err); }
    if(!upload) { return res.send(404); }
    var updated = _.merge(upload, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, upload);
    });
  });
};

// Deletes a upload from the DB.
exports.destroy = function(req, res) {
  Upload.findById(req.params.id, function (err, upload) {
    if(err) { return handleError(res, err); }
    if(!upload) { return res.send(404); }
    upload.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}