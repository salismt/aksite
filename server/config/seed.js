/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var _ = require('lodash'),
    Q = require('q'),
    Thing = require('../api/thing/thing.model'),
    User = require('../api/user/user.model'),
    Post = require('../api/post/post.model'),
    Photo = require('../api/photo/photo.model'),
    Project = require('../api/project/project.model'),
    FeaturedItem = require('../api/featured/featuredItem.model.js'),
    FeaturedSection = require('../api/featured/featuredSection.model.js'),
    FeaturedController = require('../api/featured/featured.controller.js'),
    Gallery = require('../api/gallery/gallery.model.js'),
    config = require('./environment'),
    util = require('../util'),
    gm = require('gm'),
    moment = require('moment'),

    mongoose = require('mongoose'),
    fs = require('fs'),
    Grid = require('gridfs-stream'),
    Schema = mongoose.Schema,
    gridSchema = new Schema({}, {strict: false}),
    gridModel1 = mongoose.model("gridModel1", gridSchema, "fs.files"),
    gfs,
    conn = mongoose.createConnection(config.mongo.uri);

Grid.mongo = mongoose.mongo;

FeaturedSection.find({}).remove(function() {});
FeaturedItem.find({}).remove(function() {});

Thing.find({}).remove(function() {
    Thing.create({
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
});

conn.once('open', function(err) {
    if(err) return console.log(err);
    gfs = new Grid(conn.db);

    // Delete all files in GridFS
    gridModel1.find({}, function(err, gridfiles) {
        if(err) console.log(err);
        else {
            _.forEach(gridfiles, function(file) {
                util.deleteFile({_id: file._id});
            });
        }
    });

    // Create an orphaned file
    util.saveFileFromFs('data/proj_0_cover.jpg')
        .catch(console.log)
        .then(function(file) {
            console.log('Created orphaned file: ' + file._id);
        });

    User.find({}).remove(function() {
        util.saveFileFromFs('client/assets/images/default_user.jpg')
            .catch(console.log)
            .then(function(userImgFile) {
                User.create({
                    provider: 'local',
                    providers: { local: true },
                    name: 'Test User',
                    email: 'test@test.com',
                    password: 'test',
                    imageId: userImgFile._id,
                    smallImageId: userImgFile._id
                }, {
                    provider: 'local',
                    providers: { local: true },
                    role: 'admin',
                    name: 'Admin',
                    email: 'admin@admin.com',
                    password: 'admin',
                    imageId: userImgFile._id,
                    smallImageId: userImgFile._id
                })
                    .then(function(results) {
                        console.log('finished populating users');
                        User.find({}, console.log);

                        Post.find({}).remove(function() {
                            var posts = _.map(_.range(20), function(arg) {
                                return {
                                    title: "Test Post "+arg,
                                    alias: "test-post-"+arg,
                                    hidden: false,
                                    author: {
                                        name: "Andrew Koroluk",
                                        imageId: userImgFile._id,
                                        smallImageId: userImgFile._id
                                    },
                                    date: moment().add(arg, 'days').format(),
                                    imageId: null,
                                    content: "This is test post number **"+arg+"**",
                                    subheader: "This is test post number **"+arg+"**",
                                    categories: ["tests"]
                                };
                            });
                            Post.create(posts, function() { console.log('finished populating posts'); });
                        });
                    });

                Project.find({}).remove(function() {
                    var newProject = {
                        name: ".synth 1.0",
                        info: "Modular Synthesizer",
                        hidden: false,
                        content: "**.synth** (or dotsynth) is a modular synthesizer written in Javascript. Its purpose is to expose the Web Audio API in a user-friendly manner.\n" +
                        "It works on both click and touch devices that utilize modern web browsers.\n" +
                        "This project was done as part of Boilermake, Purdue's first hackathon. It won 3rd place.\n\n" +
                        "<a href=\"http://scottlittle.me/dotsynth\" class=\"btn btn-lg btn-primary\">Demo</a> " +
                        "<a href=\"https://github.com/Awk34/dotsynth\" class=\"btn btn-lg btn-default\"><i class=\"fa fa-github\"></i> View on GitHub</a>"
                    };
                    util.saveFileFromFs('data/proj_0_thumb.jpg')
                        .catch(console.log)
                        .then(function(projectThumbFile) {
                            newProject.thumbnailId = projectThumbFile._id;
                            util.saveFileFromFs('data/proj_0_cover.jpg')
                                .catch(console.log)
                                .then(function(projectCoverFile) {
                                    newProject.coverId = projectCoverFile._id;
                                    Project.create(newProject)
                                        .then(function() {
                                            console.log('Finished creating project0');
                                        });

                                    Photo.find({}).remove(function() {
                                        var photos = [
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

                                        var photoPromises = [];
                                        _.forEach(photos, function(photo, index) {
                                            photoPromises.push(createPhoto({
                                                name: 'test'+index,
                                                info: 'testInfo'+index,
                                                sourceUri: photo
                                            }));
                                        });

                                        Q.allSettled(photoPromises)
                                            .then(function(results) {
                                                console.log('finished populating photos');

                                                Gallery.find({}).remove(function() {
                                                    Photo.find(function(err, items) {
                                                        if(err) return console.log(err);
                                                        else {
                                                            Gallery.create({
                                                                name: 'testGallery',
                                                                info: 'Test gallery',
                                                                photos: _.pluck(items, '_id'),
                                                                featuredId: items[0]._id,
                                                                date: new Date(),
                                                                hidden: false
                                                            }, function(err, gallery) {
                                                                if(err) {
                                                                    console.log(err);
                                                                } else {
                                                                    console.log('Gallery Created', gallery._id);
                                                                }
                                                            });
                                                        }
                                                    });
                                                });
                                            });
                                    });
                                });
                        });
                });
            });
    });
});

function createPhoto(photo) {
    var deferred = Q.defer(),
        photoModel = {
            name: photo.name,
            info: photo.info,
            hidden: false
        };

    util.saveFileFromFs(photo.sourceUri)
        .catch(console.log)
        .then(function(file) {
            console.log(photo.name+' -> '+file._id);
            photoModel.fileId = file._id;

            // Thumbnail generation
            util.createThumbnail(file._id, {
                width: null,
                height: 400
            })
                .catch(console.log)
                .then(function(thumbnail) {
                    console.log(photo.name+' -> (thumb)'+thumbnail.id);
                    photoModel.thumbnailId = thumbnail.id;
                    photoModel.width = thumbnail.originalWidth;
                    photoModel.height = thumbnail.originalHeight;

                    // Square thumbnail generation
                    util.createThumbnail(file._id)
                        .catch(console.log)
                        .then(function(sqThumbnail) {
                            console.log(photo.name+' -> (sqThumb)'+sqThumbnail.id);
                            photoModel.sqThumbnailId = sqThumbnail.id;

                            Photo.create(photoModel)
                                .then(function(result) {
                                    deferred.resolve(result);
                                });
                        });
                });
            //TODO: Run ^these^ two promises at once
        });

    return deferred.promise;
}
