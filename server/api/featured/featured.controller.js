'use strict';

var _ = require('lodash'),
    Q = require('q'),
    mongoose = require('mongoose'),
    FeaturedItem = require('./featuredItem.model.js'),
    FeaturedSection = require('./featuredSection.model.js'),
    Photo = require('../photo/photo.model.js'),
    fs = require('fs'),
    path = require('path'),
    config = require('../../config/environment'),
    gm = require('gm'),
    Grid = require('gridfs-stream'),
    conn = mongoose.createConnection(config.mongo.uri);

Grid.mongo = mongoose.mongo;

var gfs;
conn.once('open', function(err) {
    if(err) {
        handleError(err);
        return;
    }
    gfs = Grid(conn.db);
});

// Get the Featured Section
exports.index = function(req, res) {
    FeaturedSection.findOne({}, function(err, section) {
        if(err) return handleError(res, err);
        else if(_.isNull(section)) return res.status(500).end();
        else return res.status(200).json(section);
    });
};

exports.listItems = function(req, res) {
    FeaturedItem.find(function(err, items) {
        if(err) {
            return handleError(res, err);
        } else {
            return res.status(200).json(items);
        }
    });
};

// Compose a new Featured Section
exports.newFeatured = function(req, res) {
    FeaturedSection.find({}).remove(function() {
    });
    FeaturedItem.find({}, function(err, items) {
        if(err) return handleError(res, err);
        else if(_.isNull(items) || items == []) return res.status(500).end();
        else {
            // If there are less than 100 items, copy items until we have 100
            var index = 0,
                initLen = items.length;
            while(items.length < 100) {
                items.push(items[index]);
                index++;
                if(index === initLen) index = 0;
            }

            // Setup read streams for each image
            var readStreams = [],
                tmpPromises = [],
                k = 0;
            _.forEach(items, function(item) {
                var stream = gfs.createReadStream({_id: item.sqThumbnailId});
                stream.on('error', handleGridStreamErr(res));
                readStreams.push(stream);
                tmpPromises.push(writeToTmp(stream, k));
                k++;
            });

            return Q.all(tmpPromises)
                .then(function(results) {
                    if(results.length !== 100) return res.status(500).end();
                    var row0 = gm(results[0]);

                    for(var x = 1; x < 10; x++) {
                        //console.log(0 + ', ' + x);
                        row0.append(results[x], true);
                    }

                    var writestream = fs.createWriteStream(path.resolve(config.root + '/.gmtmp/tmp_row0.jpg'));
                    row0.stream(function(err, stdout/*, stderr, cmd*/) {
                        if(err) return err;
                        else stdout.pipe(writestream);
                    });
                    return results;
                })
                .then(function(results) {
                    var i, j;
                    for(i = 1; i < 10; i++) {
                        //console.log(i + ', ' + (10 * i));
                        var row = gm(results[10 * i]);
                        for(j = 2; j <= 10; j++) {
                            //console.log(i + ', ' + (j + (10 * i) - 1));
                            row.append(results[j + (10 * i) - 1], true);
                        }
                        var writestream = fs.createWriteStream(path.resolve(config.root + '/.gmtmp/tmp_row' + i + '.jpg'));
                        row.stream(function(err, stdout/*, stderr, cmd*/) {
                            if(err) return err;
                            else stdout.pipe(writestream);
                        });
                    }
                })
                .then(function() {
                    var rows = [],
                        gmstate;
                    Q.fcall(function() {
                        var range = _.range(10);
                        _.forEach(range, function(row) {
                            rows.push(path.resolve(config.root + '/.gmtmp/tmp_row' + row + '.jpg'));
                        });
                    })
                        .then(function() {
                            gmstate = gm();
                            _.forEach(rows, function(row) {
                                gmstate.append(row);
                            });
                            return gmstate;
                        })
                        .then(function(gmstate) {
                            setTimeout(function() {
                                gmstate.stream(function(err, outStream/*, stderr, cmd*/) {
                                    if(err) return err;
                                    else {
                                        var writestream = gfs.createWriteStream({filename: 'featured.jpg'});
                                        writestream.on('close', function(file) {
                                            //console.log(file);
                                            FeaturedSection.create({
                                                fileId: file._id,
                                                items: items
                                            }, function(err, section) {
                                                if(err) return res.status(500).send(err);
                                                else {
                                                    res.status(201).send(section);
                                                }
                                            });
                                        });
                                        outStream.pipe(writestream);
                                    }
                                });
                            }, 200);
                        });
                });
        }
    });
};


// Add an Item to the DB
exports.add = function(req, res) {
    if(!isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid ID');
    }
    var acceptedTypes = ['photo', 'project', 'post'];
    var item = {};
    if(!req.body.type || !_.contains(acceptedTypes, req.body.type.toLowerCase())) {
        var typesString = '';
        _.forEach(acceptedTypes, function(type, i) {
            if(i == acceptedTypes.length - 1) typesString += ' &';
            typesString += ' ' + type + ',';
        });
        typesString = typesString.substring(0, typesString.length - 1);
        typesString += '.';
        return res.status(400).send('Error: Please supply an accepted item type. The supported types are:' + typesString);
    } else if(!req.params.id) {
        return res.status(400).send('Error: Invalid item ID.');
    }

    item.type = req.body.type;
    item.name = req.body.name || 'TEST';
    item.link = req.body.link || '#';

    switch(req.body.type) {
        case 'photo':
            Photo.findById(req.params.id, function(err, photo) {
                if(err)
                    return handleError(res, err);
                else if(!photo)
                    return res.status(404).end();
                else {
                    if(photo.sqThumbnailId) {
                        item.sqThumbnailId = photo.sqThumbnailId;

                        return FeaturedItem.create(item, function(err, featured) {
                            if(err) return handleError(res, err);
                            else return res.status(201).json(featured);
                        });
                    } else if(photo.fileId) {
                        //TODO: if doesn't have a thumbnail
                        return res.status(500).end();
                    } else {
                        return res.status(500).end();
                    }
                }
            });
            break;
        case 'project':
            return res.status(500).send('Error: Server not set up for item of type ' + req.body.type + '.');
            break;
        case 'post':
            return res.status(500).send('Error: Server not set up for item of type ' + req.body.type + '.');
            break;
        default:
            return res.status(500).end();
    }
};

// Deletes a featured item
exports.destroy = function(req, res) {
    if(!isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid ID');
    }
    FeaturedItem.findById(req.params.id, function(err, featured) {
        if(err) {
            return handleError(res, err);
        }
        if(!featured) {
            return res.status(404).end();
        }
        featured.remove(function(err) {
            if(err) {
                return handleError(res, err);
            }
            return res.send(204);
        });
    });
};

function handleError(res, err) {
    return res.status(500).send(err);
}

function handleGridStreamErr(res) {
    return function(err) {
        if(/does not exist/.test(err)) {
            // trigger 404
            console.log(err);
            return err;
        }

        // may have written data already
        res.status(500).end();
        console.error(err.stack);
    };
}

function writeToGridFS(readStream, data) {
    var deferred = Q.defer();

    (function next() {
        var writestream = gfs.createWriteStream(data);
        readStream.pipe(writestream).on('close', deferred.resolve);
    })();

    return deferred.promise;
}

function writeToTmp(readStream, name) {
    var deferred = Q.defer();

    (function next() {
        if(_.isNull(name) || _.isUndefined(name) || name === '') return new Error('No name given to tmp file');
        else {
            var filename = path.resolve(config.root + '/.gmtmp/tmp_' + name + '.jpg')
            var writestream = fs.createWriteStream(filename);
            readStream.pipe(writestream).on('close', function() {
                deferred.resolve(filename);
            });
        }
    })();

    return deferred.promise;
}

function isValidObjectId(objectId) {
    return new RegExp("^[0-9a-fA-F]{24}$").test(objectId);
}
