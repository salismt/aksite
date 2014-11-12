/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var _ = require('lodash'),
    Thing = require('../api/thing/thing.model'),
    User = require('../api/user/user.model'),
    Photo = require('../api/photo/photo.model'),
    Project = require('../api/project/project.model'),
    FeaturedItem = require('../api/featured/featuredItem.model.js'),
    FeaturedSection = require('../api/featured/featuredSection.model.js'),
    FeaturedController = require('../api/featured/featured.controller.js'),
    Gallery = require('../api/gallery/gallery.model.js'),
    config = require('./environment'),
    gm = require('gm'),

    mongoose = require('mongoose'),
    fs = require('fs'),
    Grid = require('gridfs-stream'),
    Schema = mongoose.Schema,
    gridSchema = new Schema({}, {strict: false}),
    gridModel1 = mongoose.model("gridModel1", gridSchema, "fs.files");
Grid.mongo = mongoose.mongo;

var gfs,
    conn = mongoose.createConnection(config.mongo.uri);

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

User.find({}).remove(function() {
    User.create({
            provider: 'local',
            name: 'Test User',
            email: 'test@test.com',
            password: 'test'
        }, {
            provider: 'local',
            role: 'admin',
            name: 'Admin',
            email: 'admin@admin.com',
            password: 'admin'
        }, function() {
            console.log('finished populating users');
        }
    );
});

conn.once('open', function(err) {
    if(err) {
        console.log(err);
        return;
    }
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

    Project.find({}).remove(function() {
        var newProject = {
            name: ".synth 1.0",
            info: "Javascript modular synthesizer",
            link: "http://github.com/awk34/dotsynth/"
        };
        var thumbWritestream = gfs.createWriteStream([]);
        thumbWritestream.on('close', function(file) {
            newProject.thumbnailId = file._id;
            var coverWritestream = gfs.createWriteStream([]);
            coverWritestream.on('close', function(file) {
                newProject.coverId = file._id;
                Project.create(newProject, function(proj) {
                    console.log('Finished creating project0');
                });
            });
            fs.createReadStream('data/proj_0_cover.jpg').pipe(coverWritestream);
        });
        fs.createReadStream('data/proj_0_thumb.jpg').pipe(thumbWritestream);
    });

    Photo.find({}).remove(function() {
        var photos = [{
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
        }];

        _.forEach(photos, function(photo) {
            var photoModel = {
                name: photo.name,
                info: photo.info,
                sourceUri: photo.sourceUri
            };

            var writestream = gfs.createWriteStream([]);
            writestream.on('close', function(file) {
                photoModel.fileId = file._id;

                // Thumbnail generation
                var stream = gfs.createReadStream({_id: file._id});
                stream.on('error', console.log);
                var img = gm(stream, file.id);
                img.resize(200, 200, "^");
                img.crop(200, 200, 0, 0);
                img.quality(90);
                img.stream(function(err, outStream) {
                    if(err) return res.status(500).end();
                    else {
                        var thumbwritestream = gfs.createWriteStream({filename: file.name});
                        thumbwritestream.on('close', function(file) {
                            photoModel.thumbnailId = file._id;

                            Photo.create(photoModel, function(err, photo1) {
                                if(err) return console.log(err);
                                else return photo1;
                            });
                        });
                        outStream.pipe(thumbwritestream);
                    }
                });
            });
            fs.createReadStream(photo.sourceUri).pipe(writestream);
        });

        console.log('finished populating photos');

        setTimeout(function() {
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
                                    featuredItem.link = '#';
                                    featuredItem.type = 'photo';

                                    FeaturedItem.create(featuredItem);
                                });

                                Gallery.create({
                                    name: 'testGallery',
                                    info: 'Test gallery',
                                    photos: _.pluck(items, '_id'),
                                    featuredId: items[0]._id,
                                    date: new Date()
                                }, function(err, gallery) {
                                    if(err) {
                                        console.log(err);
                                    } else {
                                        //console.log(gallery._id);
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
            console.log('finished populating featured items');
        }, 500);
    });
});