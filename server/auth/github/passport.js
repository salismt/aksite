'use strict';
import {
    saveFileFromUrl,
    createThumbnail
} from '../../util';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github';

export function setup(User, config) {
    passport.use(new GitHubStrategy({
        clientID: config.gitHub.clientID,
        clientSecret: config.gitHub.clientSecret,
        callbackURL: config.gitHub.callbackURL,
        passReqToCallback: true
    }, function(req, accessToken, refreshToken, profile, done) {
        if(req.user) {
            User.findById(req.user._id)
                .catch(done)
                .then(function(user) {
                    if(!user) return done();

                    user.providers.github = true;
                    user.github = profile._json;
                    return user.save()
                        .catch(done)
                        .then(savedUser => done(null, savedUser));
                });
        } else {
            User.findOne({ 'github.id': profile._json.id }).exec()
                .catch(done)
                .then(function(user) {
                    // User is logging in with this account
                    if(user) return done(null, user);

                    // There are no users linked to this account. Make a new one
                    var newUser = new User({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        role: 'user',
                        provider: 'github',
                        providers: { github: true },
                        github: profile._json
                    });

                    var profilePic = profile._json.profile_image_url;
                    var picName = profilePic.split('/')[profilePic.split('/').length - 1];

                    return saveFileFromUrl(profile._json.avatar_url, {
                        filename: picName,
                        contentType: 'image/jpeg'
                    })
                        .catch(done)
                        .then(function(file) {
                            console.log(file);
                            newUser.imageId = file._id;

                            return createThumbnail(file._id, {filename: picName})
                                .catch(done)
                                .then(function(thumbnail) {
                                    console.log(thumbnail);
                                    newUser.smallImageId = thumbnail.id;

                                    return newUser.save()
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
