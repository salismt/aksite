'use strict';

// Register the Babel require hook
require('babel-core/register');
global.Reflect = require('harmony-reflect');    // Also affects Proxy

// Export the application
module.exports = require('./app');
