'use strict';
/*eslint no-process-env:0*/

// Production specific configuration
// =================================
export default {
    // Server IP
    ip: process.env.OPENSHIFT_NODEJS_IP
        || process.env.IP
        || '0.0.0.0',

    // Server port
    port: process.env.OPENSHIFT_NODEJS_PORT
        || process.env.PORT
        || 80,

    client: '/client',

    // MongoDB connection options
    mongo: {
        uri: process.env.MONGOLAB_URI
            || process.env.MONGOHQ_URL
            || process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME
            || 'mongodb://localhost/aksite'
    }
};
