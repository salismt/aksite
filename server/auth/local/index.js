'use strict';
import { Router } from 'express';
import passport from 'passport';
import * as auth from '../auth.service';

var router = new Router();

router.post('/', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        var error = err || info;
        if(error) return res.status(401).json(error);
        if(!user) return res.status(404).json({message: 'Something went wrong, please try again.'});

        auth.signToken(user._id, user.role).then(token => {
            res.json({token});
        }).catch(err => {
            res.status(500).send(err);
        });
    })(req, res, next);
});

export default router;
