/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');

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
			password: 'theguy'
		}, function () {
			console.log('finished populating users');
		}
	);
});