'use strict';
import {
    saveFileFromUrl,
    createThumbnail
} from '../../util';
import passport from 'passport';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';

export function setup(User, config) {
    passport.use(new LinkedInStrategy({
        clientID: config.linkedin.clientID,
        clientSecret: config.linkedin.clientSecret,
        callbackURL: config.linkedin.callbackURL,
        passReqToCallback: true,
        state: true,
        profileFields: [
            'id',
            'first-name',
            'last-name',
            'email-address',
            'headline',
            'picture-url',
            'picture-urls::(original)',
            'location',
            'industry',
            'num-connections',
            'summary',
            'positions',
            'public-profile-url',
            'site-standard-profile-request',
            'api-standard-profile-request'
        ]
    }, function(req, accessToken, refreshToken, profile, done) {
        if(req.user) {
            User.findById(req.user._id)
                .catch(done)
                .then(function(user) {
                    if(!user) return done();

                    user.providers.linkedin = true;
                    user.linkedin = profile._json;
                    return user.save()
                        .catch(done)
                        .then(savedUser => done(null, savedUser));
                });
        } else {
            User.findOne({ 'linkedin.id': profile._json.id }).exec()
                .catch(done)
                .then(function(user) {
                    // User is logging in with this account
                    if(user) return done(null, user);

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

                        var profilePic = profile._json.pictureUrls._total < 1 ? profile._json.pictureUrl : profile._json.pictureUrls.values[0];
                        var picName = profilePic.split('/')[profilePic.split('/').length - 1];

                        return saveFileFromUrl(profilePic, {
                            filename: picName,
                            contentType: 'image/jpeg'
                        })
                            .catch(done)
                            .then(function(file) {
                                console.log(file);
                                newUser.imageId = file._id;

                                return createThumbnail(file._id, {filename: `${picName}_thumbnail`})
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
                    }
                });
        }
    }));
}
