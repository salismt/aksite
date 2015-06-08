'use strict';

var _ = require('lodash');
var express = require('express');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var auth = require('../auth.service');
var config = require('../../config/environment');

var router = express.Router();

router
    .get('/', passport.authenticate('github', {
        failureRedirect: '/signup',
        scope: [
            'user:email'
        ],
        session: false
    }))

    .get('/callback', auth.addAuthHeaderFromCookie(), auth.appendUser(), passport.authenticate('github', {
        failureRedirect: '/signup',
        session: false
    }), auth.setTokenCookie);

module.exports = router;
