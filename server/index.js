'use strict';

// Register the Babel require hook
require('babel-core/register')({
    resolveModuleSource(originalSource) {
        if(originalSource === 'lodash') {
            return 'lodash-es';
        } else {
            return originalSource;
        }
    }
});
global.Reflect = require('harmony-reflect');    // Also affects Proxy

// Export the application
module.exports = require('./app');
