'use strict';

var express         = require('express'),
    controller      = require('./file.controller'),
    auth            = require('../../auth/auth.service'),
    router          = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
//router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/test/:id', controller.test);

module.exports = router;
