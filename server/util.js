'use strict';

/**
 * Server Utility Functions
 */
import _ from 'lodash';
import q from 'q';
import request from 'request';
import fs from 'fs';
import config from './config/environment';
import mongoose from 'mongoose';
import gm from 'gm';
import Grid from 'gridfs-stream';
import BufferStream from './components/BufferStream';

var conn = mongoose.createConnection(config.mongo.uri);
Grid.mongo = mongoose.mongo;
const gfs = new Grid(conn.db);

/**
 * Creates a thumbnail in GridFS based on the ID passed
 *
 * @param {ObjectId} id         - The ID of the image in GridFS to create a thumbnail of
 * @param {Object} [options]    - Optional options
 * @param {number} [options.height=200] - The height of the thumbnail, in pixels
 * @param {number} [options.width=200] - The width of the thumbnail, in pixels
 * @param {number} [options.quality=90] - The quality of the thumbnail
 * @param {string} [options.filename=''] - The filename to use
 */
export function createThumbnail(id, options = {}) {
    var deferred = q.defer(),
        thumbnail = {};

    _.defaults(options, {
        height: 200,
        width: 200,
        quality: 90
    });

    var stream = gfs.createReadStream({_id: id});
    stream.on('error', deferred.reject);
    gm(stream, id)
        .size({bufferStream: true}, function(err, size) {
            if(err) return deferred.reject(err);
            thumbnail.width = options.width;
            thumbnail.height = options.height;
            thumbnail.originalWidth = size.width;
            thumbnail.originalHeight = size.height;
            if(options.width === null) {
                this.resize(options.width, options.height);
            } else {
                this.resize(options.width, options.height, "^");
                this.crop(options.width, options.height, 0, 0);
            }
            this.quality(options.quality);
            this.stream(function(err, outStream) {
                if(err) return deferred.reject(err);
                else {
                    var writestream = gfs.createWriteStream({
                        filename: options.filename
                    });
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
}

/**
 * Makes a request for a file from a URL, and stores it in GridFS
 * @param {String} url
 * @param {Object} [options]
 * @param {String} [options.filename]
 * @param {String} [options.contentType]
 */
export function saveFileFromUrl(url, options = {}) {
    var deferred = q.defer();

    var writestream = gfs.createWriteStream({
        filename: options.filename,
        contentType: options.contentType
    });
    writestream.on('error', deferred.reject);
    writestream.on('close', function(file) {
        deferred.resolve(file);
    });
    request(url).pipe(writestream);

    return deferred.promise;
}

/**
 * Stores a file from a filesystem path in GridFS
 * @param {String} uri
 * @param {Object} [options]
 * @param {String} [options.filename]
 * @param {String} [options.contentType]
 */
export function saveFileFromFs(uri, options = {}) {
    var deferred = q.defer();

    var writestream = gfs.createWriteStream({
        filename: options.filename,
        contentType: options.contentType
    });
    writestream.on('error', deferred.reject);
    writestream.on('close', function(file) {
        deferred.resolve(file);
    });
    fs.createReadStream(uri).pipe(writestream);

    return deferred.promise;
}

/**
 * Stores a file from a filesystem path in GridFS
 * @param buffer {ArrayBuffer}
 * @param {Object} [options]
 * @param {String} [options.filename]
 * @param {String} [options.contentType]
 */
export function saveFileFromBuffer(buffer, options = {}) {
    var deferred = q.defer();

    var writestream = gfs.createWriteStream({
        filename: options.filename,
        contentType: options.contentType
    });
    writestream.on('error', deferred.reject);
    writestream.on('close', function(file) {
        deferred.resolve(file);
    });
    new BufferStream(buffer).pipe(writestream);

    return deferred.promise;
}

/**
 * Removes a file from GridFS
 * @param {Object} options
 * @param {string|ObjectID} options._id
 */
export function deleteFile(options = {}) {
    var deferred = q.defer();

    if(!options._id) {
        return deferred.reject('options._id is required');
    }

    gfs.remove({_id: options._id}, function(err, document) {
        if(err) return deferred.reject(err);
        deferred.resolve(document);
    });

    return deferred.promise;
}

/**
 * Returns whether or not the given string is a valid ObjectID
 * @param {string} objectId
 * @returns {boolean}
 */
export function isValidObjectId(objectId) {
    return /^[0-9a-fA-F]{24}$/.test(objectId);
}

/**
 * Sends a 500 Internal Server Error
 * @param res
 * @param [err]
 */
export function handleError(res, err) {
    res.status(500).send(err);
}
