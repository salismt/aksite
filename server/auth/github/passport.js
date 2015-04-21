'use strict';

var _ = require('lodash');
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;

exports.setup = function(User, config) {
    passport.use(new GitHubStrategy({
            clientID: config.gitHub.clientID,
            clientSecret: config.gitHub.clientSecret,
            callbackURL: config.gitHub.callbackURL,
            passReqToCallback: true
        },
        function(req, accessToken, refreshToken, profile, done) {
            if(req.user) {
                User.findById(req.user._id, function(err, user) {
                    if(user) {
                        user.providers.github = true;
                        user.github = profile._json;
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
                    provider: 'github',
                    providers: { github: true },
                    github: profile._json
                });
                user.save(function(err) {
                    if(err) done(err);
                    return done(err, user);
                });
            }
        }
    ));
};
