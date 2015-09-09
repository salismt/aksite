'use strict';

import _ from 'lodash';
import q from 'q';
import * as util from '../../util';
import path from 'path';
import Photo from '../photo/photo.model';
import Gallery from '../gallery/gallery.model';
import Project from '../project/project.model';
import User from '../user/user.model';
import FeaturedSection from '../featured/featuredSection.model';
import config from '../../config/environment';
import mongoose from 'mongoose';
import fs from 'fs';
import gridform from 'gridform';
import {ExifImage} from 'exif';
import gm from 'gm';
import {Schema} from 'mongoose';
import Grid from 'gridfs-stream';

let gridSchema = new Schema({}, {strict: false});
let gridModel = mongoose.model('gridModel', gridSchema, 'fs.files');
let gfs;
let conn = mongoose.createConnection(config.mongo.uri);

gridform.mongo = mongoose.mongo;
Grid.mongo = mongoose.mongo;

conn.once('open', function(err) {
    if(err) return util.handleError(err);

    gfs = Grid(conn.db);
    gridform.db = conn.db;
});

const DEFAULT_PAGESIZE = 10;
const MIN_PAGESIZE = 5;
const MAX_PAGESIZE = 25;

// Get list of files
exports.index = function(req, res) {
    if(req.query.page && req.query.page < 1) return res.status(400).send('Invalid page');

    var pageSize = (req.query.pagesize && req.query.pagesize <= MAX_PAGESIZE && req.query.pagesize > MIN_PAGESIZE) ? req.query.pagesize : DEFAULT_PAGESIZE;
    var page = parseInt(req.query.page) || 0;

    gridModel.count({}, function(err, count) {
        if(err) return util.handleError(res, err);

        gridModel.find()
            .limit(pageSize)
            .sort('date')
            .skip((req.query.page-1) * pageSize || 0)//doesn't scale well, I'll worry about it later
            .exec(function(err, files) {
                if(err) return util.handleError(res, err);

                return res.status(200).json({
                    page: page,
                    pages: Math.ceil(count / pageSize),
                    items: files,
                    numItems: count
                });
            });
    });
};

// Get a single file
exports.show = function(req, res) {
    if(req.params.id.substring(24) === '.jpg') {
        req.params.id = req.params.id.substring(0, 24);
    }
    if(!util.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid ID');
    }
    gfs.exist({_id: req.params.id}, function(err, found) {
        if(err) return util.handleError(err);
        else if(!found) return res.status(404).end();
        else {
            res.header('Content-Type', 'image/jpeg');
            gfs.createReadStream({ _id: req.params.id })
                .on('error', _.partial(util.handleError, res))
                .pipe(res);
        }
    });
};

// Get the number of uploads
exports.count = function(req, res) {
    gridModel.count({}, function(err, count) {
        if(err) util.handleError(res, err);
        else res.status(200).json(count);
    });
};

// Creates a new file in the DB.
exports.create = function(req, res) {
    var form = gridform({db: conn.db, mongo: mongoose.mongo});

    // optionally store per-file metadata
    form.on('fileBegin', function(name, file) {
        file.metadata = {};
    });

    form.parse(req, function(err, fields, files) {
        if(err) return util.handleError(res, err);

        /**
         * file.name            - the uploaded file name
         * file.type            - file type per [mime](https://github.com/bentomas/node-mime)
         * file.size            - uploaded file size (file length in GridFS) named "size" for compatibility
         * file.path            - same as file.name. included for compatibility
         * file.lastModified    - included for compatibility
         * file.root            - the root of the files collection used in MongoDB ('fs' here means the full collection in mongo is named 'fs.files')
         * file.id              - the ObjectId for this file
         * @type {file}
         */
        var file = files.file;

        if(_.isNull(file) || _.isUndefined(file))
            return res.status(400).send(new Error('No file'));

        console.log(file.name+' -> '+file.id);
        //console.log(fields);

        if(!_.isEmpty(fields)) {
            if(fields.name && typeof fields.name === 'string') {
                file.name = fields.name;
            }
            if(fields.purpose && typeof fields.purpose === 'string') {
                file.purpose = fields.purpose;

                if(fields.purpose.toLowerCase() === 'photo') {
                    var photoModel = {
                        name: file.name,
                        fileId: file.id
                    };
                    if(fields.info && typeof fields.purpose === 'string')
                        photoModel.info = fields.info;

                    var promises = [
                        getExif(file.id)
                            .then(function(exifData) {
                                photoModel.metadata = { exif: exifData.exif, image: exifData.image, gps: exifData.gps };
                                console.log(exifData);
                            }),
                        util.createThumbnail(file.id, {
                            width: null,
                            height: 400
                        })
                            .then(function(thumbnail) {
                                console.log(file.name+' -> (thumb)'+thumbnail.id);
                                photoModel.thumbnailId = thumbnail.id;
                                photoModel.width = thumbnail.originalWidth;
                                photoModel.height = thumbnail.originalHeight;
                            }),
                        util.createThumbnail(file.id)
                            .then(function(squareThumbnail) {
                                console.log(file.name+' -> (sqThumb)'+squareThumbnail.id);
                                photoModel.sqThumbnailId = squareThumbnail.id;
                            })
                    ];

                    q.all(promises)
                        .spread(function() {
                            Photo.create(photoModel, function(err, photo) {
                                if(err) return util.handleError(res, err);
                                else return res.status(201).json(photo);
                            });
                        }, res.status(400).send);
                }
            }
        } else {
            return res.status(400).end();
        }
    });
};

// Updates an existing file in the DB.
//exports.update = function(req, res) {
//    if(!util.isValidObjectId(req.params.id)) {
//        return res.status(400).send('Invalid ID');
//    }
//    if(req.body._id) {
//        delete req.body._id;
//    }
//    Upload.findById(req.params.id, function(err, upload) {
//        if(err) {
//            return util.handleError(res, err);
//        } else if(!upload) {
//            return res.send(404);
//        } else {
//            var updated = _.merge(upload, req.body);
//            updated.save(function(err) {
//                if(err) {
//                    return util.handleError(res, err);
//                }
//                return res.json(200, upload);
//            });
//        }
//    });
//};

// Deletes a file from the DB.
exports.destroy = function(req, res) {
    if(!util.isValidObjectId(req.params.id))
        return res.status(400).send('Invalid ID');
    if(!req.params.id)
        return res.status(404).send(new ReferenceError('File not found.'));
    else
        gfs.remove({_id: req.params.id}, function(err) {
            if(err) return util.handleError(err);
            res.status(200).end();
        });
};

// Finds and cleans orphaned GridFS files
exports.clean = function(req, res) {
    /**
     * This baby plucks all of the GridFS document IDs from all Photos, Projects,
     * Users, and FeaturedSections. It then compares that list to a list of all documents
     * in GridFS. If the GridFS document isn't used in the first list, it gets deleted.
     */
    q.all([
        getIds(gridModel, ['_id']),
        getIds(Photo, ['fileId', 'thumbnailId', 'sqThumbnailId']),
        getIds(Project, ['thumbnailId', 'coverId']),
        getIds(User, ['imageId', 'smallImageId']),
        getIds(FeaturedSection, ['fileId'])
    ])
        .spread(function(fileIds, photoIds, projectIds, userIds, featSectionIds) {
            _.forEach(_.difference(_.invoke(fileIds, 'toString'), _.invoke(_.union(photoIds, projectIds, userIds, featSectionIds), 'toString')), function(id) {
                gfs.remove({_id: id}, function(err) {
                    if(err) return console.log(err);
                    console.log('Delete file', id);
                });
            });
        }, console.log);

    /**
     * This little gem generates a list of all the Photos that aren't
     * in a Gallery, and then deletes those photos, along with the three files
     * in GridFS linked to each of them.
     */
    q.all([
        getIds(Gallery, ['photos']),
        Photo.find().exec()
    ])
        .spread(function(photosInGalleries, allPhotos) {
            _.forEach(_.difference(_.invoke(_.pluck(allPhotos, '_id'), 'toString'), _.flatten(photosInGalleries)), function(id) {
                Photo.findByIdAndRemove(id, function(err, photo) {
                    if(err) return console.log(err);

                    console.log('Delete photo', photo._id);
                    util.deleteFile({_id: photo.fileId});
                    util.deleteFile({_id: photo.thumbnailId});
                    util.deleteFile({_id: photo.sqThumbnailId});
                });
            });
        }, console.log);

    res.status(202).end();
};

/**
 * Takes an image from a GridFS document ID, uses GM to stream it to a buffer,
 * and then uses the exif library to extract its EXIF data and return it
 * @param id    - ID of the GridFS image file to get EXIF data for
 * @returns {deferred.promise|{then, always}}
 */
function getExif(id) {
    var deferred = q.defer();

    gm(gfs.createReadStream({_id: id}).on('error', console.log), id)
        .toBuffer('JPG', function(err, buffer) {
            if(err) return deferred.reject(err);
            new ExifImage({ image: buffer }, function (error, exifData) {
                if(error) deferred.reject(error);
                else deferred.resolve(exifData);
            });
        });

    return deferred.promise;
}

/**
 * Fetches every document of `model`, plucks each property in `properties` out
 * of it, and returns them all in one flattened array
 * @param model         - The mongoose model in which to get all of the documents for
 * @param properties    - An array of model property names, as strings
 * @returns {deferred.promise}
 */
function getIds(model, properties) {
    var deferred = q.defer();

    model.find({}, function(err, files) {
        if(err) deferred.reject(err);
        else deferred.resolve(_.flatten(_.map(properties, _.partial(_.pluck, files))));
    });

    return deferred.promise;
}
