'use strict';

var _ = require("lodash");
var passport = require('passport');
var LinkedInStrategy = require('passport-linkedin').Strategy;

exports.setup = function(User, config) {
    passport.use(new LinkedInStrategy({
            consumerKey: config.linkedIn.clientID,
            consumerSecret: config.linkedIn.clientSecret,
            callbackURL: config.linkedIn.callbackURL,
            passReqToCallback: true,
            profileFields: ['id', 'first-name', 'last-name', 'email-address', 'headline', 'picture-url', 'picture-urls::(original)', 'location', 'industry', 'num-connections', 'summary', 'positions', 'public-profile-url', 'site-standard-profile-request', 'api-standard-profile-request']
        },
        function(req, accessToken, refreshToken, profile, done) {
            if(req.user) {
                User.findById(req.user._id, function(err, user) {
                    if(user) {
                        if(!_.includes(user.providers, 'linkedin')) {
                            user.providers.push('linkedin');
                        }
                        user.linkedIn = profile._json;
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
                    provider: 'linkedin',
                    providers: ['linkedin'],
                    linkedIn: profile._json
                });
                user.save(function(err) {
                    if(err) done(err);
                    return done(err, user);
                });
            }
        }
    ));
};
