'use strict';

var express = require('express'),
    auth = require('../../auth/auth.service'),
    controller = require('./featured.controller.js');

var router = express.Router();

router.get('/', controller.index);
router.get('/new', auth.hasRole('admin'), controller.newFeatured);
//router.get('/:id', controller.show);
router.get('/items', controller.listItems);
router.post('/:id', auth.hasRole('admin'), controller.add);
//router.post('/', controller.create);
//router.put('/:id', controller.update);
//router.patch('/:id', controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
//router.get('/test', controller.test);

module.exports = router;
