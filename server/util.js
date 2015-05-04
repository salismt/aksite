'use strict';

/**
 * Server Utility Functions
 */

var _ = require('lodash'),
    q = require('q'),
    request = require('request'),
    //path = require('path'),
    config = require('./config/environment'),
    mongoose = require('mongoose'),
    gm = require('gm'),
    Grid = require('gridfs-stream'),
    gfs,
    conn = mongoose.createConnection(config.mongo.uri);

Grid.mongo = mongoose.mongo;

conn.once('open', function(err) {
    if(err) console.log(err);
    else gfs = Grid(conn.db);
});

/**
 * Creates a thumbnail in GridFS based on the ID passed
 *
 * @param {ObjectId} id         - The ID of the image in GridFS to create a thumbnail of
 * @param {Object} [options]    - Optional options
 * @param {number} [options.height=200] - The height of the thumbnail, in pixels
 * @param {number} [options.width=200] - The width of the thumbnail, in pixels
 * @param {number} [options.quality=90] - The quality of the thumbnail
 */
exports.createThumbnail = function(id, options) {
    var deferred = q.defer(),
        thumbnail = {};

    options = options ? options : {};
    _.defaults(options, {
        height: 200,
        width: 200,
        quality: 90
    });

    var stream = gfs.createReadStream({_id: id});
    stream.on('error', deferred.reject);
    gm(stream, id)
        .size({bufferStream: true}, function(err, size) {
            thumbnail.width = size.width;
            thumbnail.height = size.height;
            this.resize(options.height, options.width, "^");
            this.crop(options.height, options.width, 0, 0);
            this.quality(options.quality);
            this.stream(function(err, outStream) {
                if(err) return deferred.reject(err);
                else {
                    var writestream = gfs.createWriteStream({});
                    writestream.on('close', function(thumbnailFile) {
                        thumbnail.file = thumbnailFile;
                        thumbnail.id = thumbnailFile._id;

                        return deferred.resolve(thumbnail);
                    });
                    outStream.pipe(writestream);
                }
            });
        });

    return deferred.promise;
};

/**
 * Makes a request for a file from a URL, and stores it in GridFS
 * @param {string} url
 */
exports.saveFileFromUrl = function(url) {
    var deferred = q.defer();

    var writestream = gfs.createWriteStream({});
    writestream.on('error', deferred.reject);
    writestream.on('close', function(file) {
        deferred.resolve(file);
    });
    request(url).pipe(writestream);

    return deferred.promise;
};
