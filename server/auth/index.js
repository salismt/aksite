'use strict';

import { Router } from 'express';
import config from '../config/environment';
import User from '../api/user/user.model';

// Passport Configuration
require('./local/passport').setup(User, config);
require('./facebook/passport').setup(User, config);
require('./google/passport').setup(User, config);
require('./twitter/passport').setup(User, config);
require('./github/passport').setup(User, config);
require('./linkedin/passport').setup(User, config);

var router = new Router();

router.use('/local', require('./local'));
router.use('/facebook', require('./facebook'));
router.use('/google', require('./google'));
router.use('/twitter', require('./twitter'));
router.use('/github', require('./github'));
router.use('/linkedin', require('./linkedin'));

module.exports = router;
