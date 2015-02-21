'use strict';

var express = require('express');
var controller = require('./gallery.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.appendUser(), controller.index);
router.get('/count', auth.hasRole('admin'), controller.count);
router.get('/:id', auth.appendUser(), controller.show);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
