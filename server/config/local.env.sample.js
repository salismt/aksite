'use strict';

// Use local.env.js for environment variables that grunt will set when the server starts locally.
// Use for your api keys, secrets, etc. This file should not be tracked by git.
//
// You will need to set these on the server you deploy to.

module.exports = {
    DOMAIN: 'http://localhost:9000',
    SESSION_SECRET: "aksite-secret",

    FACEBOOK_ID: 'app-id',
    FACEBOOK_SECRET: 'secret',

    TWITTER_ID: 'app-id',
    TWITTER_SECRET: 'secret',

    GOOGLE_ID: 'app-id',
    GOOGLE_SECRET: 'secret',

    LINKEDIN_ID: 'app-id',
    LINKEDIN_SECRET: 'secret',

    GITHUB_ID: 'app-id',
    GITHUB_SECRET: 'secret',

    OPBEAT_ORGANIZATION_ID: 'org-id',
    OPBEAT_APP_ID: 'app-id',
    OPBEAT_SECRET_TOKEN: 'secret',

    // Control debug level for modules using visionmedia/debug
    DEBUG: ''
};
