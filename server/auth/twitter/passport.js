'use strict';

var _ = require('lodash');
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

exports.setup = function(User, config) {
    passport.use(new TwitterStrategy({
            consumerKey: config.twitter.clientID,
            consumerSecret: config.twitter.clientSecret,
            callbackURL: config.twitter.callbackURL,
            passReqToCallback: true
        },
        function(req, accessToken, refreshToken, profile, done) {
            if(req.user) {
                User.findById(req.user._id, function(err, user) {
                    if(user) {
                        user.providers.twitter = true;
                        user.twitter = profile._json;
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
                    provider: 'twitter',
                    providers: { twitter: true },
                    twitter: profile._json
                });
                user.save(function(err) {
                    if(err) done(err);
                    return done(err, user);
                });
            }
        }
    ));
};
