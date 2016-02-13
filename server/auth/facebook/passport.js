'use strict';
import util from '../../util';
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';

export function setup(User, config) {
    passport.use(new FacebookStrategy({
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        callbackURL: config.facebook.callbackURL,
        passReqToCallback: true
    }, function(req, accessToken, refreshToken, profile, done) {
        if(req.user) {
            User.findById(req.user._id)
                .catch(done)
                .then(function(user) {
                    if(!user) return done();

                    user.providers.facebook = true;
                    user.facebook = profile._json;
                    return user.save()
                        .catch(done)
                        .then(savedUser => done(null, savedUser));
                });
        } else {
            User.findOne({ 'facebook.id': profile._json.id }).exec()
                .catch(done)
                .then(function(user) {
                    // User is logging in with this account
                    if(user) return done(null, user);

                    // There are no users linked to this account. Make a new one
                    var newUser = new User({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        role: 'user',
                        provider: 'facebook',
                        providers: { facebook: true },
                        facebook: profile._json
                    });

                    var profilePic = profile._json.profile_image_url;
                    var picName = profilePic.split('/')[profilePic.split('/').length - 1];

                    return util.saveFileFromUrl(`https://graph.facebook.com/${profile._json.id}/picture?type=large`, {
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
