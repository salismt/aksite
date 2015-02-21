'use strict';

var express = require('express'),
    auth = require('../../auth/auth.service'),
    controller = require('./upload.controller');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/clean', auth.hasRole('admin'), controller.clean);
router.get('/count', auth.hasRole('admin'), controller.count);
router.get('/:id', controller.show);
router.get('/:id/size', auth.hasRole('admin'), controller.showSize);
router.post('/', auth.hasRole('admin'), controller.create);
//router.put('/:id', controller.update);
//router.patch('/:id', controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
