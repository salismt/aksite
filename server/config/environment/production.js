'use strict';
/*eslint no-process-env:0*/

// Production specific configuration
// =================================
export default {
    // Server IP
    ip: process.env.IP
        || '0.0.0.0',

    // Server port
    port: process.env.PORT
        || 80,

    client: '/client',

    // MongoDB connection options
    mongo: {
        uri: process.env.MONGODB_URI
            || 'mongodb://localhost/aksite'
    }
};
