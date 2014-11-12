'use strict';

var express = require('express'),
    auth = require('../../auth/auth.service'),
    controller = require('./upload.controller');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:id', controller.show);
router.post('/', auth.hasRole('admin'), controller.create);
//router.put('/:id', controller.update);
//router.patch('/:id', controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;