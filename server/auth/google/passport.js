'use strict';

var _ = require('lodash');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

exports.setup = function(User, config) {
    passport.use(new GoogleStrategy({
            clientID: config.google.clientID,
            clientSecret: config.google.clientSecret,
            callbackURL: config.google.callbackURL,
            passReqToCallback: true
        },
        function(req, accessToken, refreshToken, profile, done) {
            if(req.user) {
                User.findById(req.user._id, function(err, user) {
                    if(user) {
                        user.providers.google = true;
                        user.google = profile._json;
                        user.save(function(err) {
                            if(err) done(err);
                            return done(err, user);
                        });
                    } else {
                        return done(err);
                    }
                });
            } else {
                var user = new User({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    role: 'user',
                    provider: 'google',
                    providers: { google: true },
                    google: profile._json
                });
                user.save(function(err) {
                    if(err) done(err);
                    return done(err, user);
                });
            }
        }
    ));
};
