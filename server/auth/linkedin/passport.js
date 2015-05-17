'use strict';

var util = require('../../util'),
    config = require('../../config/environment'),
    passport = require('passport'),
    LinkedInStrategy = require('passport-linkedin-oauth2').Strategy,
    request = require('request');

exports.setup = function(User, config) {
    passport.use(new LinkedInStrategy({
            clientID: config.linkedin.clientID,
            clientSecret: config.linkedin.clientSecret,
            callbackURL: config.linkedin.callbackURL,
            passReqToCallback: true,
            state: true,
            profileFields: ['id', 'first-name', 'last-name', 'email-address', 'headline', 'picture-url', 'picture-urls::(original)', 'location', 'industry', 'num-connections', 'summary', 'positions', 'public-profile-url', 'site-standard-profile-request', 'api-standard-profile-request']
        },
        function(req, accessToken, refreshToken, profile, done) {
            if(req.user) {
                User.findById(req.user._id, function(err, user) {
                    if(user) {
                        user.providers.linkedin = true;
                        user.linkedin = profile._json;
                        user.save(function(err) {
                            if(err) done(err);
                            return done(err, user);
                        });
                    } else {
                        return done(err);
                    }
                });
            } else {
                User.findOne({ 'linkedin.id': profile._json.id })
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
                                provider: 'linkedin',
                                providers: { linkedin: true },
                                linkedin: profile._json
                            });

                            var profilePic = profile._json.pictureUrls._total < 1 ? profile._json.pictureUrl : profile._json.pictureUrls.values[0],
                                picName = profilePic.split('/')[profilePic.split('/').length-1];

                            util.saveFileFromUrl(profilePic, {
                                filename: picName,
                                content_type: 'image/jpeg'
                            })
                                .catch(done)
                                .then(function(file) {
                                    console.log(file);
                                    newUser.imageId = file._id;

                                    util.createThumbnail(file._id, {filename: picName+'_thumbnail'})
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
