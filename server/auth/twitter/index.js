'use strict';
import { Router } from 'express';
import passport from 'passport';
import * as auth from '../auth.service';

var router = new Router();

router
    .get('/', passport.authenticate('twitter', {
        failureRedirect: '/signup',
        session: false
    }))
    .get('/callback', auth.addAuthHeaderFromCookie(), auth.appendUser(), passport.authenticate('twitter', {
        failureRedirect: '/signup',
        session: false
    }), auth.setTokenCookie);

export default router;
