'use strict';
import { Router } from 'express';
import passport from 'passport';
import * as auth from '../auth.service';

var router = new Router();

router
    .get('/', passport.authenticate('linkedin', {
        failureRedirect: '/signup',
        scope: [
            //'r_network',
            //'r_fullprofile',
            //'r_contactinfo',
            'r_emailaddress'
        ],
        session: false
    }))
    .get('/callback', auth.addAuthHeaderFromCookie(), auth.appendUser(), passport.authenticate('linkedin', {
        failureRedirect: '/signup',
        session: false
    }), auth.setTokenCookie);

export default router;
