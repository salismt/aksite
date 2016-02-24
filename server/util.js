/**
 * Server Utility Functions
 */
'use strict';
import _ from 'lodash';
import Promise from 'bluebird';
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
 * @returns {Promise} -
 */
export function createThumbnail(id, options = {}) {
    return new Promise((resolve, reject) => {
        var thumbnail = {};

        _.defaults(options, {
            height: 200,
            width: 200,
            quality: 90
        });

        var stream = gfs.createReadStream({_id: id});
        stream.on('error', reject);
        gm(stream, id)
            .size({bufferStream: true}, function(err, size) {
                /*eslint no-invalid-this: 0*/
                if(err) return reject(err);
                thumbnail.width = options.width;
                thumbnail.height = options.height;
                thumbnail.originalWidth = size.width;
                thumbnail.originalHeight = size.height;
                if(options.width === null) {
                    this.resize(options.width, options.height);
                } else {
                    this.resize(options.width, options.height, '^');
                    this.crop(options.width, options.height, 0, 0);
                }
                this.quality(options.quality);
                this.stream(function(err, outStream) {
                    if(err) return reject(err);
                    else {
                        var writestream = gfs.createWriteStream({
                            filename: options.filename
                        });
                        writestream.on('close', function(thumbnailFile) {
                            thumbnail.file = thumbnailFile;
                            thumbnail.id = thumbnailFile._id;

                            return resolve(thumbnail);
                        });
                        outStream.pipe(writestream);
                    }
                });
            });
    });
}

/**
 * Makes a request for a file from a URL, and stores it in GridFS
 * @param {String} url - Internet URL to grab file from
 * @param {Object} [options={}] - options object
 * @param {String} [options.filename] - filename to save it with
 * @param {String} [options.contentType] - Content-Type to save it with
 * @returns {Promise} -
 */
export function saveFileFromUrl(url, options = {}) {
    return new Promise((resolve, reject) => {
        var writestream = gfs.createWriteStream({
            filename: options.filename,
            contentType: options.contentType
        });
        writestream.on('error', reject);
        writestream.on('close', function(file) {
            resolve(file);
        });
        request(url).pipe(writestream);
    });
}

/**
 * Stores a file from a filesystem path in GridFS
 * @param {String} uri - Filesystem URI to grab the file from
 * @param {Object} [options={}] - options object
 * @param {String} [options.filename] - filename to save it with
 * @param {String} [options.contentType] - Content-Type to save it with
 * @returns {Promise} -
 */
export function saveFileFromFs(uri, options = {}) {
    return new Promise((resolve, reject) => {
        var writestream = gfs.createWriteStream({
            filename: options.filename,
            contentType: options.contentType
        });
        writestream.on('error', reject);
        writestream.on('close', function(file) {
            resolve(file);
        });
        fs.createReadStream(uri).pipe(writestream);
    });
}

/**
 * Stores a file from a filesystem path in GridFS
 * @param {ArrayBuffer} buffer - Buffer to save to GridFS
 * @param {Object} [options={}] - options object
 * @param {String} [options.filename] - filename to save it with
 * @param {String} [options.contentType] - Content-Type to save it with
 * @returns {Promise} -
 */
export function saveFileFromBuffer(buffer, options = {}) {
    return new Promise((resolve, reject) => {
        var writestream = gfs.createWriteStream({
            filename: options.filename,
            contentType: options.contentType
        });
        writestream.on('error', reject);
        writestream.on('close', function(file) {
            resolve(file);
        });
        new BufferStream(buffer).pipe(writestream);
    });
}
/**
 * Removes a file from GridFS
 * @param {Object} options - options object
 * @param {string|ObjectId} options._id - guid of the file to remove
 * @returns {Promise} - Resolves to the document deleted
 */
export function deleteFile(options = {}) {
    return new Promise((resolve, reject) => {
        if(!options._id) return reject('options._id is required');

        gfs.remove({_id: options._id}, function(err, document) {
            if(err) return reject(err);
            resolve(document);
        });
    });
}

/**
 * @param {string} objectId - ObjectID string to test
 * @returns {boolean} - whether or not the given string is a valid ObjectID
 */
export function isValidObjectId(objectId) {
    return /^[0-9a-fA-F]{24}$/.test(objectId);
}

/**
 * Sends a 500 Internal Server Error
 * @param {Object} res - Express response object
 * @param {*} [err] - Error
 * @returns {null} -
 */
export function handleError(res, err) {
    res.status(500).send(err);
}
