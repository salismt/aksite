'use strict';

var util = require('../../util'),
    config = require('../../config/environment'),
    passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    request = require('request');

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
                User.findOne({ 'facebook.id': profile._json.id })
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
                                provider: 'facebook',
                                providers: { facebook: true },
                                facebook: profile._json
                            });

                            util.saveFileFromUrl('https://graph.facebook.com/' + profile._json.id + '/picture?type=large', {
                                filename: 'facebook_profile_picture_' + profile._json.id,
                                contentType: 'image/jpeg'
                            })
                                .catch(done)
                                .then(function(file) {
                                    console.log(file);
                                    newUser.imageId = file._id;

                                    util.createThumbnail(file._id, {filename: 'facebook_profile_picture_' + profile._json.id + '_thumbnail'})
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
