'use strict';

// Register the Babel require hook
require('babel-register')({
    ignore(filename) {
        return filename.indexOf('lodash-es') === -1
            && filename.indexOf('node_modules') !== -1;
    }
});
global.Reflect = require('harmony-reflect');    // Also affects Proxy

// Export the application
module.exports = require('./app');
