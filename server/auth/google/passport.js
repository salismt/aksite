'use strict';
import util from '../../util';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

export function setup(User, config) {
    passport.use(new GoogleStrategy({
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackURL,
        passReqToCallback: true
    }, function(req, accessToken, refreshToken, profile, done) {
        // If user is logged in when request is processed
        if(req.user) {
            User.findById(req.user._id)
                .catch(done)
                .then(function(user) {
                    if(!user) return done();

                    user.providers.google = true;
                    user.google = profile._json;
                    return user.save()
                        .catch(done)
                        .then(savedUser => done(null, savedUser));
                });
        } else {
            User.findOne({ 'google.id': profile._json.id }).exec()
                .catch(done)
                .then(function(user) {
                    // User is logging in with this account
                    if(user) return done(null, user);

                    // There are no users linked to this account. Make a new one
                    profile._json.image.url = profile._json.image.url.replace('?sz=50', '');

                    var newUser = new User({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        role: 'user',
                        provider: 'google',
                        providers: { google: true },
                        google: profile._json
                    });

                    var profilePic = profile._json.image.url;
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
