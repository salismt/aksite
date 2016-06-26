'use strict';
/*eslint no-process-env:0*/

// Development specific configuration
// ==================================
export default {
    // List of user roles
    userRoles: ['guest', 'user', 'admin'],

    sentry: {
        publicDsn: process.env.SENTRY_PUBLIC_DSN || ''
    }
};
