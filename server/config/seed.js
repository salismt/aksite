/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var Photo = require('../api/photo/photo.model');
var config = require('./environment');

//var rootDir = config.root;
var rootDir = '';

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
    Photo.create({
            name: 'test',
            info: 'testInfo',
            hidden: false,
            sourceUri: rootDir + '/data/IMG_4149.JPG'
        }, {
            name: 'test',
            info: 'testInfo',
            hidden: false,
            sourceUri: rootDir + '/data/IMG_4150.JPG'
        }, {
            name: 'test',
            info: 'testInfo',
            hidden: false,
            sourceUri: rootDir + '/data/IMG_4151.JPG'
        }, {
            name: 'test',
            info: 'testInfo',
            hidden: false,
            sourceUri: rootDir + '/data/IMG_4152.JPG'
        }, {
            name: 'test',
            info: 'testInfo',
            hidden: false,
            sourceUri: rootDir + '/data/IMG_4153.JPG'
        }, {
            name: 'test',
            info: 'testInfo',
            hidden: false,
            sourceUri: rootDir + '/data/IMG_4154.JPG'
        }, {
            name: 'test',
            info: 'testInfo',
            hidden: false,
            sourceUri: rootDir + '/data/IMG_4155.JPG'
        }, {
            name: 'test',
            info: 'testInfo',
            hidden: false,
            sourceUri: rootDir + '/data/IMG_4156.JPG'
        }, {
            name: 'test',
            info: 'testInfo',
            hidden: false,
            sourceUri: rootDir + '/data/IMG_4157.JPG'
        }, {
            name: 'test',
            info: 'testInfo',
            hidden: false,
            sourceUri: rootDir + '/data/IMG_4158.JPG'
        }, {
            name: 'test',
            info: 'testInfo',
            hidden: false,
            sourceUri: rootDir + '/data/IMG_4159.JPG'
        }, {
            name: 'test',
            info: 'testInfo',
            hidden: false,
            sourceUri: rootDir + '/data/IMG_4161.JPG'
        }, function () {
            console.log('finished populating photos');
        }
    );
});