/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

import _ from 'lodash';
import Q from 'q';
import Promise from 'bluebird';
import Thing from '../api/thing/thing.model';
import User from '../api/user/user.model';
import Post from '../api/post/post.model';
import Photo from '../api/photo/photo.model';
import Project from '../api/project/project.model';
import Gallery from '../api/gallery/gallery.model.js';
import config from './environment';
import * as util from '../util';
import gm from 'gm';
import moment from 'moment';
import mongoose from 'mongoose';
import fs from 'fs';
import Grid from 'gridfs-stream';

const Schema = mongoose.Schema;
const gridSchema = new Schema({}, {strict: false});
const gridModel1 = mongoose.model("gridModel1", gridSchema, "fs.files");

let cb = _.noop;

function deleteThings() {
    return Thing.find({}).remove();
}

function seedThings() {
    return Thing.create({
        name: 'Thing 1',
        info: 'Hi, I\'m Thing 1'
    }, {
        name: 'Thing 2',
        info: 'Hi, I\'m Thing 2'
    }, {
        name: 'Thing 3',
        info: 'Hi, I\'m Thing 3'
    }, {
        name: 'Thing 4',
        info: 'Hi, I\'m Thing 4'
    }, {
        name: 'Thing 5',
        info: 'Hi, I\'m Thing 5'
    }, {
        name: 'Thing 5',
        info: 'Hi, I\'m Thing 5'
    });
}

/**
 * Delete all files in GridFS
 */
function deleteFiles() {
    return gridModel1.find({})
        .then(function(gridfiles) {
            return _.map(gridfiles, file => util.deleteFile({_id: file._id}));
        });
}

// Create an orphaned file
util.saveFileFromFs('data/proj_0_cover.jpg')
    .catch(console.log)
    .tap(({_id}) => console.log(`Created orphaned file: ${_id}`));

function deleteUsers() {
    return User.find({}).remove();
}

function createUsers(userImageId) {
    return User.create({
        provider: 'local',
        providers: { local: true },
        name: 'Test User',
        email: 'test@example.com',
        password: 'test',
        imageId: userImageId,
        smallImageId: userImageId
    }, {
        provider: 'local',
        providers: { local: true },
        role: 'admin',
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin',
        imageId: userImageId,
        smallImageId: userImageId
    });
}

function deletePosts() {
    return Post.find({}).remove();
}

function createPosts(userImageId) {
    return Post.create(_.map(_.range(20), n => ({
        title: "Test Post " + n,
        alias: "test-post-" + n,
        hidden: false,
        author: {
            name: "Andrew Koroluk",
            imageId: userImageId,
            smallImageId: userImageId
        },
        date: moment().add(n, 'days').format(),
        imageId: null,
        content: "This is test post number **"+n+"**",
        subheader: "This is test post number **"+n+"**",
        categories: ["tests"]
    })))
        .tap(() => console.log('finished populating posts'));
}

function deleteProjects() {
    return Project.find({}).remove();
}

function createProject(coverId, thumbnailId) {
    return Project.create({
        name: '.synth 1.0',
        info: 'Modular Synthesizer',
        hidden: false,
        coverId,
        thumbnailId,
        content: `**.synth** (or dotsynth) is a modular synthesizer written in Javascript. Its purpose is to expose the Web Audio API in a user-friendly manner.
It works on both click and touch devices that utilize modern web browsers.
This project was done as part of Boilermake, Purdue's first hackathon. It won 3rd place.

<a href=\"http://scottlittle.me/dotsynth\" class=\"btn btn-lg btn-primary\">Demo</a>
<a href=\"https://github.com/Awk34/dotsynth\" class=\"btn btn-lg btn-default\"><i class=\"fa fa-github\"></i> View on GitHub</a>`
    })
        .tap(() => console.log('Finished creating project0'));
}

function deletePhotos() {
    return Photo.find({}).remove();
}

const PHOTO_PATHS = [
    'data/IMG_4149.JPG',
    'data/IMG_4150.JPG',
    'data/IMG_4151.JPG',
    'data/IMG_4152.JPG',
    'data/IMG_4153.JPG',
    'data/IMG_4154.JPG',
    'data/IMG_4155.JPG',
    'data/IMG_4156.JPG',
    'data/IMG_4157.JPG',
    'data/IMG_4158.JPG',
    'data/IMG_4159.JPG',
    'data/IMG_4161.JPG'
];
function createPhotos() {
    return Promise.all(_.map(PHOTO_PATHS, (path, index) => createPhoto({
        name: 'test' + index,
        info: 'testInfo' + index,
        sourceUri: path
    })));
}

function deleteGalleries() {
    return Gallery.find({}).remove()
}

function createGallery(photos) {
    return Gallery.create({
        name: 'testGallery',
        info: 'Test gallery',
        photos: _.pluck(photos, '_id'),
        featuredId: photos[0]._id,
        date: new Date(),
        hidden: false
    })
        .tap(({_id}) => console.log('Gallery Created', _id));
}

deleteUsers().then(function() {
    return util.saveFileFromFs('client/assets/images/default_user.jpg')
        .catch(console.log)
        .then(function(userImgFile) {
            let p1 = createUsers(userImgFile._id).then(function(users) {
                console.log('finished populating users');
                console.log(users);

                return deletePosts()
                    .then(() => createPosts(userImgFile._id));
            });

            let p2 = deleteProjects().then(function() {
                return Promise.all([util.saveFileFromFs('data/proj_0_cover.jpg'), util.saveFileFromFs('data/proj_0_thumb.jpg')])
                    .then(([projectCoverFile, projectThumbFile]) => {
                        return createProject(projectCoverFile._id, projectThumbFile._id);
                    })
                    .catch(console.log);
            });

            return Promise.all([p1, p2])
                .then(cb);
        });
});

function createPhoto(photo) {
    return util.saveFileFromFs(photo.sourceUri)
        .catch(console.log)
        .then(function(file) {
            console.log(`${photo.name} -> ${file._id}`);

            // Thumbnail generation
            let thumbPromise = util.createThumbnail(file._id, {
                width: null,
                height: 400
            })
                .tap(thumbnail => console.log(`${photo.name} -> (thumb)${thumbnail.id}`));

            // Square Thumbnail Generation
            let squareThumbPromise = util.createThumbnail(file._id)
                .tap(sqThumbnail => console.log(`${photo.name} -> (sqThumb)${sqThumbnail.id}`));

            return Promise.all([thumbPromise, squareThumbPromise]).then(([thumbnail, sqThumbnail]) => {
                return Photo.create({
                    name: photo.name,
                    info: photo.info,
                    hidden: false,
                    fileId: file._id,
                    thumbnailId: thumbnail.id,
                    width: thumbnail.originalWidth,
                    height: thumbnail.originalHeight,
                    sqThumbnailId: sqThumbnail.id
                });
            });
        });
}

export default function(callback) {
    if(callback) {
        cb = callback;
    }

    let p1 = deleteThings()
        .then(seedThings);

    let p2 = deleteFiles();

    let p3 = deletePhotos().then(function() {
        return createPhotos().then(function(photos) {
            console.log('finished populating photos');

            return deleteGalleries().then(function() {
                return createGallery(photos);
            });
        });
    });

    return Promise.all([p1, p2, p3]);
}
