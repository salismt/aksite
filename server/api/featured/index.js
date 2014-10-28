'use strict';

var express = require('express');
var controller = require('./featured.controller.js');

var router = express.Router();

router.get('/', controller.index);
router.get('/new', controller.newFeatured);
//router.get('/:id', controller.show);
router.post('/:id', controller.add);
//router.post('/', controller.create);
//router.put('/:id', controller.update);
//router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);
//router.get('/test', controller.test);

module.exports = router;
