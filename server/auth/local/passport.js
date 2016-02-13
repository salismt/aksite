'use strict';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

export function setup(User) {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password' // this is the virtual field on the model
    }, function(email, password, done) {
        User.findOne({
            email: email.toLowerCase()
        }).exec()
            .catch(done)
            .then(function(user) {
                if(!user) {
                    return done(null, false, {message: 'This email is not registered.'});
                } else if(!user.authenticate(password)) {
                    return done(null, false, {message: 'This password is not correct.'});
                } else {
                    return done(null, user);
                }
            });
    }));
}
