'use strict';

var util = require('../../util'),
    config = require('../../config/environment'),
    passport = require('passport'),
    GitHubStrategy = require('passport-github').Strategy,
    request = require('request');

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
                User.findOne({ 'github.id': profile._json.id })
                    .exec(function(err, user) {
                        if(err) return done(err);

                        // User is logging in with this account
                        if(user) return done(err, user);

                        // There are no users linked to this account. Make a new one
                        else {
                            var newUser = new User({
                                name: profile.displayName,
                                email: profile.emails[0].value,
                                role: 'user',
                                provider: 'github',
                                providers: { github: true },
                                github: profile._json
                            });

                            util.saveFileFromUrl(profile._json.avatar_url, {
                                filename: 'github_profile_picture_'+profile._json,
                                contentType: 'image/jpeg'
                            })
                                .catch(done)
                                .then(function(file) {
                                    console.log(file);
                                    newUser.imageId = file._id;

                                    util.createThumbnail(file._id, {filename: 'github_profile_picture_'+profile._json+'_thumbnail'})
                                        .catch(done)
                                        .then(function(thumbnail) {
                                            console.log(thumbnail);
                                            newUser.smallImageId = thumbnail.id;

                                            newUser.save(function(err) {
                                                if(err) return done(err);
                                                return done(err, newUser);
                                            });
                                        });
                                });
                        }
                    });
            }
        }
    ));
};
