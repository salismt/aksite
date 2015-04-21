'use strict';

var _ = require('lodash');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

exports.setup = function(User, config) {
    passport.use(new FacebookStrategy({
            clientID: config.facebook.clientID,
            clientSecret: config.facebook.clientSecret,
            callbackURL: config.facebook.callbackURL,
            passReqToCallback: true
        },
        function(req, accessToken, refreshToken, profile, done) {
            if(req.user) {
                User.findById(req.user._id, function(err, user) {
                    if(user) {
                        user.providers.facebook = true;
                        user.facebook = profile._json;
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
                    provider: 'facebook',
                    providers: { facebook: true },
                    facebook: profile._json
                });
                user.save(function(err) {
                    if(err) done(err);
                    return done(err, user);
                });
            }
        }
    ));
};
