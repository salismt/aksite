'use strict';
import util from '../../util';
import passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';

export function setup(User, config) {
    passport.use(new TwitterStrategy({
        consumerKey: config.twitter.clientID,
        consumerSecret: config.twitter.clientSecret,
        callbackURL: config.twitter.callbackURL,
        passReqToCallback: true
    }, function(req, accessToken, refreshToken, profile, done) {
        if(req.user) {
            User.findById(req.user._id)
                .catch(done)
                .then(function(user) {
                    if(!user) return done();

                    user.providers.twitter = true;
                    user.twitter = profile._json;
                    return user.save()
                        .catch(done)
                        .then(savedUser => done(null, savedUser));
                });
        } else {
            User.findOne({ 'twitter.id': profile._json.id }).exec()
                .catch(done)
                .then(function(user) {
                    // User is logging in with this account
                    if(user) return done(null, user);

                    // There are no users linked to this account. Make a new one
                    /*eslint camelcase:0*/
                    profile._json.profile_image_url = profile._json.profile_image_url.replace('_normal', '');
                    profile._json.profile_image_url_https = profile._json.profile_image_url_https.replace('_normal', '');

                    var newUser = new User({
                        name: profile.displayName,
                        role: 'user',
                        provider: 'twitter',
                        providers: { twitter: true },
                        twitter: profile._json
                    });

                    var profilePic = profile._json.profile_image_url;
                    var picName = profilePic.split('/')[profilePic.split('/').length - 1];

                    return util.saveFileFromUrl(profilePic, {
                        filename: picName,
                        contentType: 'image/jpeg'
                    })
                        .catch(done)
                        .then(function(file) {
                            console.log(file);
                            newUser.imageId = file._id;

                            return util.createThumbnail(file._id, {filename: picName})
                                .catch(done)
                                .then(function(thumbnail) {
                                    console.log(thumbnail);
                                    newUser.smallImageId = thumbnail.id;

                                    return newUser.save
                                        .catch(done)
                                        .then(savedUser => {
                                            done(null, savedUser);
                                        });
                                });
                        });
                });
        }
    }));
}
