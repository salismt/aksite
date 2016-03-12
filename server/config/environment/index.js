'use strict';
/*eslint no-process-env:0*/

var path = require('path');
var _ = require('lodash');

let localEnv;
try {
    localEnv = require('../local.env');
} catch(e) {
    localEnv = {};
}

_.forEach(localEnv, (value, key) => {
    process.env[key] = value;
});

//function requiredProcessEnv(name) {
//    if(!process.env[name]) {
//        throw new Error('You must set the ' + name + ' environment variable');
//    }
//    return process.env[name];
//}

// All configurations will extend these options
// ============================================
var all = {
    env: process.env.NODE_ENV,

    // Root path of server
    root: path.normalize(path.join(__dirname, '/../../..')),

    client: '/client',

    server: '/server',

    domain: process.env.DOMAIN || '',

    // Server port
    port: process.env.PORT || 9050,

    // Server IP
    ip: process.env.IP || '0.0.0.0',

    // Should we populate the DB with sample data?
    seedDB: false,

    // Secret for session, you will want to change this and make it an environment variable
    secrets: {
        session: 'aksite-secret'
    },

    // List of user roles
    userRoles: ['guest', 'user', 'admin'],

    // MongoDB connection options
    mongo: {
        options: {
            db: {
                safe: true
            }
        }
    },

    facebook: {
        clientID: process.env.FACEBOOK_ID || 'id',
        clientSecret: process.env.FACEBOOK_SECRET || 'secret',
        callbackURL: (process.env.DOMAIN || '') + '/auth/facebook/callback'
    },

    twitter: {
        clientID: process.env.TWITTER_ID || 'id',
        clientSecret: process.env.TWITTER_SECRET || 'secret',
        callbackURL: (process.env.DOMAIN || '') + '/auth/twitter/callback'
    },

    google: {
        clientID: process.env.GOOGLE_ID || 'id',
        clientSecret: process.env.GOOGLE_SECRET || 'secret',
        callbackURL: (process.env.DOMAIN || '') + '/auth/google/callback'
    },

    linkedin: {
        clientID: process.env.LINKEDIN_ID || 'id',
        clientSecret: process.env.LINKEDIN_SECRET || 'secret',
        callbackURL: (process.env.DOMAIN || '') + '/auth/linkedin/callback'
    },

    gitHub: {
        clientID: process.env.GITHUB_ID || 'id',
        clientSecret: process.env.GITHUB_SECRET || 'secret',
        callbackURL: (process.env.DOMAIN || '') + '/auth/github/callback'
    },

    opbeat: {
        orgId: process.env.OPBEAT_ORGANIZATION_ID || '',
        appId: process.env.OPBEAT_APP_ID || '',
        secret: process.env.OPBEAT_SECRET_TOKEN || ''
    }
};

// Export the config object based on the NODE_ENV
// ==============================================
export default _.merge(all, require(`./${process.env.NODE_ENV || 'production'}.js`).default || {});
