'use strict';

import { Router } from 'express';
import config from '../config/environment';
import User from '../api/user/user.model';

// Passport Configuration
require('./local/passport').setup(User, config);
require('./google/passport').setup(User, config);
require('./github/passport').setup(User, config);
require('./linkedin/passport').setup(User, config);

var router = new Router();

router.use('/local', require('./local').default);
router.use('/google', require('./google').default);
router.use('/github', require('./github').default);
router.use('/linkedin', require('./linkedin').default);

module.exports = router;
