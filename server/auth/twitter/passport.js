'use strict';

var util = require('../../util'),
    config = require('../../config/environment'),
    passport = require('passport'),
    TwitterStrategy = require('passport-twitter').Strategy,
    request = require('request');

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
                User.findOne({ 'twitter.id': profile._json.id })
                    .exec(function(err, user) {
                        if(err) return done(err);

                        // User is logging in with this account
                        if(user) return done(err, user);

                        // There are no users linked to this account. Make a new one
                        else {
                            profile._json.profile_image_url = profile._json.profile_image_url.replace('_normal', '');
                            profile._json.profile_image_url_https = profile._json.profile_image_url_https.replace('_normal', '');

                            var newUser = new User({
                                name: profile.displayName,
                                role: 'user',
                                provider: 'twitter',
                                providers: { twitter: true },
                                twitter: profile._json
                            });

                            var profilePic = profile._json.profile_image_url,
                                picName = profilePic.split('/')[profilePic.split('/').length-1];

                            util.saveFileFromUrl(profilePic, {
                                filename: picName,
                                content_type: 'image/jpeg'
                            })
                                .catch(done)
                                .then(function(file) {
                                    console.log(file);
                                    newUser.imageId = file._id;

                                    util.createThumbnail(file._id, {filename: picName})
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
