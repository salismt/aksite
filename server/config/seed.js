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
    gfs = Grid(conn.db);

    gridModel1.find({}, function(err, gridfiles) {
        if(err) console.log(err);
        else {
            _.forEach(gridfiles, function(file) {
                gfs.remove({_id: file._id}, function(err) {
                    if(err) console.log(err);
                });
            });
        }
    });

    User.find({}).remove(function() {
        var userImageWritestream = gfs.createWriteStream([]);
        userImageWritestream.on('close', function(userImgFile) {
            User.create({
                provider: 'local',
                name: 'Test User',
                email: 'test@test.com',
                password: 'test',
                imageId: userImgFile._id,
                smallImageId: userImgFile._id
            }, {
                provider: 'local',
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
                var thumbWritestream = gfs.createWriteStream([]);
                thumbWritestream.on('close', function(projectThumbFile) {
                    newProject.thumbnailId = projectThumbFile._id;
                    var coverWritestream = gfs.createWriteStream([]);
                    coverWritestream.on('close', function(projectCoverFile) {
                        newProject.coverId = projectCoverFile._id;
                        Project.create(newProject)
                            .then(function() {
                                console.log('Finished creating project0');
                            });

                        Photo.find({}).remove(function() {
                            var photos = [
                                {
                                    name: 'test00',
                                    info: 'testInfo',
                                    sourceUri: 'data/IMG_4149.JPG'
                                }, {
                                    name: 'test01',
                                    info: 'testInfo',
                                    sourceUri: 'data/IMG_4150.JPG'
                                }, {
                                    name: 'test02',
                                    info: 'testInfo',
                                    sourceUri: 'data/IMG_4151.JPG'
                                }, {
                                    name: 'test03',
                                    info: 'testInfo',
                                    sourceUri: 'data/IMG_4152.JPG'
                                }, {
                                    name: 'test04',
                                    info: 'testInfo',
                                    sourceUri: 'data/IMG_4153.JPG'
                                }, {
                                    name: 'test05',
                                    info: 'testInfo',
                                    sourceUri: 'data/IMG_4154.JPG'
                                }, {
                                    name: 'test06',
                                    info: 'testInfo',
                                    sourceUri: 'data/IMG_4155.JPG'
                                }, {
                                    name: 'test07',
                                    info: 'testInfo',
                                    sourceUri: 'data/IMG_4156.JPG'
                                }, {
                                    name: 'test08',
                                    info: 'testInfo',
                                    sourceUri: 'data/IMG_4157.JPG'
                                }, {
                                    name: 'test09',
                                    info: 'testInfo',
                                    sourceUri: 'data/IMG_4158.JPG'
                                }, {
                                    name: 'test10',
                                    info: 'testInfo',
                                    sourceUri: 'data/IMG_4159.JPG'
                                }, {
                                    name: 'test11',
                                    info: 'testInfo',
                                    sourceUri: 'data/IMG_4161.JPG'
                                }
                            ];

                            var photoPromises = [];
                            _.forEach(photos, function(photo) {
                                photoPromises.push(createPhoto(photo));
                            });

                            Q.allSettled(photoPromises)
                                .then(function(results) {
                                    console.log('finished populating photos');

                                    FeaturedSection.find({}).remove(function() {
                                        FeaturedItem.find({}).remove(function() {
                                            Gallery.find({}).remove(function() {
                                                Photo.find(function(err, items) {
                                                    if(err) return console.log(err);
                                                    else {
                                                        _.forEach(items, function(item) {
                                                            var featuredItem = {};
                                                            featuredItem.name = item.name;
                                                            featuredItem.thumbnailId = item.thumbnailId;
                                                            featuredItem.sqThumbnailId = item.sqThumbnailId;
                                                            featuredItem.link = '#';
                                                            featuredItem.type = 'photo';

                                                            FeaturedItem.create({
                                                                name: item.name,
                                                                thumbnailId: item.thumbnailId,
                                                                sqThumbnailId: item.sqThumbnailId,
                                                                link: '#',
                                                                type: 'photo'
                                                            });
                                                        });
                                                        console.log('finished populating featured items');

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
                                                                console.log(gallery._id);
                                                            }
                                                        });

                                                        return setTimeout(function() {
                                                            FeaturedController.newFeatured({}, {
                                                                status: function() { return this; },
                                                                send: function() { return this; }
                                                            });
                                                        }, 100);
                                                    }
                                                });
                                            });
                                        });
                                    });
                                });
                        });
                    });
                    fs.createReadStream('data/proj_0_cover.jpg').pipe(coverWritestream);
                });
                fs.createReadStream('data/proj_0_thumb.jpg').pipe(thumbWritestream);
            });
        });
        fs.createReadStream('client/assets/images/portrait_2014.jpg').pipe(userImageWritestream);
    });
});

function createPhoto(photo) {
    var deferred = Q.defer(),
        photoModel = {
        name: photo.name,
        info: photo.info,
        hidden: false
    };

    var writestream = gfs.createWriteStream([]);
    writestream.on('close', function(file) {
        console.log(photo.name+' -> '+file._id);
        photoModel.fileId = file._id;

        // Thumbnail generation
        saveThumb(file)
            .then(function(thumbnail) {
                console.log(photo.name+' -> (thumb)'+thumbnail.thumbnailId);
                photoModel.thumbnailId = thumbnail.thumbnailId;
                photoModel.width = thumbnail.width;
                photoModel.height = thumbnail.height;

                var sqThumbstream = gfs.createReadStream({_id: thumbnail.thumbnailId});
                sqThumbstream.on('error', console.log);
                gm(sqThumbstream, thumbnail.thumbnailId)
                    .size({bufferStream: true}, function(err, size) {
                        if(size.width > size.height) {
                            this.shave( (size.width - size.height)/2 );
                            this.resize(200, 200);
                        } else {
                            this.shave(0, (size.height - size.width)/2);
                            this.resize(200, 200);
                        }
                        this.crop(200, 200, 0, 0);
                        this.quality(90);
                        this.stream(function(err, outStream) {
                            if(err) console.log(err);
                            else {
                                var sqThumbWritestream = gfs.createWriteStream({filename: file.name});
                                sqThumbWritestream.on('close', function(sqThumbFile) {
                                    console.log(photo.name+' -> (sqThumb)'+sqThumbFile._id);
                                    photoModel.sqThumbnailId = sqThumbFile._id;

                                    Photo.create(photoModel)
                                        .then(function(result) {
                                            deferred.resolve(result);
                                        });
                                });
                                outStream.pipe(sqThumbWritestream);
                            }
                        });
                    });
            });
    });
    fs.createReadStream(photo.sourceUri).pipe(writestream);

    return deferred.promise;
}

function saveThumb(file) {
    var deferred = Q.defer();

    var thumbStream = gfs.createReadStream({_id: file._id});
    thumbStream.on('error', console.log);
    gm(thumbStream, file._id)
        .size({bufferStream: true}, function(err, size) {
            if(err) return deferred.reject(err);
            console.log(size);
            if(size.width > size.height) {
                this.resize(null, 400);
            } else {
                this.resize(400);
            }
            this.quality(90);
            this.stream(function(err, outStream) {
                if(err) return console.log(err);
                else {
                    var thumbWritestream = gfs.createWriteStream({filename: file.name});
                    thumbWritestream.on('close', function(thumbFile) {
                        deferred.resolve({ thumbnailId: thumbFile._id, height: size.height, width: size.width });
                    });
                    outStream.pipe(thumbWritestream);
                }
            });
        });

    return deferred.promise;
}
