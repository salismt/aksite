/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var _ = require('lodash'),
    Thing = require('../api/thing/thing.model'),
    User = require('../api/user/user.model'),
    Photo = require('../api/photo/photo.model'),
    FeaturedItem = require('../api/featured/featuredItem.model.js'),
    FeaturedSection = require('../api/featured/featuredSection.model.js'),
    config = require('./environment'),

    mongoose = require('mongoose'),
    fs = require('fs'),
    Grid = require('gridfs-stream'),
    Schema = mongoose.Schema,
    gridSchema = new Schema({}, {strict: false}),
    gridModel1 = mongoose.model("gridModel1", gridSchema, "fs.files");
Grid.mongo = mongoose.mongo;

Thing.find({}).remove(function () {
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

User.find({}).remove(function () {
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
        }, function () {
            console.log('finished populating users');
        }
    );
});

Photo.find({}).remove(function () {
    var gfs,
        conn = mongoose.createConnection(config.mongo.uri);
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
                        if(err) return console.log(err);
                        //else return console.log('deleted ' + file._id);
                    });
                });
            }
        });

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
            fs.createReadStream(photo.sourceUri).pipe(writestream);

            writestream.on('close', function(file) {
                photoModel.fileId = file._id;
                Photo.create(photoModel, function (err, photo1) {
                    if (err) return console.log(err);
                    else return photo1;
                });
            });
        });

        console.log('finished populating photos');

        setTimeout(function() {
            FeaturedSection.find({}).remove(function() {
                FeaturedItem.find({}).remove(function() {
                    Photo.find(function(err, items) {
                        if(err) return console.log(err);
                        else {
                            _.forEach(items, function(item) {
                                var featuredItem = {};
                                featuredItem.name = item.name;
                                featuredItem.thumbnailId = item.fileId;
                                featuredItem.link = '#';
                                featuredItem.type = 'photo';

                                FeaturedItem.create(featuredItem);
                            })
                        }
                    });
                });
            });
            console.log('finished populating featured items');
        }, 500);
    });
});
