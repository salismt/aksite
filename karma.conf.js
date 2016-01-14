// Karma configuration
// http://karma-runner.github.io/0.13/config/configuration-file.html

import makeWebpackConfig from './webpack.make';

module.exports = function(config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['mocha', 'chai', 'sinon-chai', 'chai-as-promised', 'chai-things', 'phantomjs-shim'],
        reporters: ['mocha', 'coverage'],

        files: [
            'spec.js'
        ],

        preprocessors: {
            'spec.js': ['webpack']
        },

        webpack: makeWebpackConfig({ TEST: true }),

        webpackMiddleware: {
            // webpack-dev-middleware configuration
            // i. e.
            noInfo: true
        },

        coverageReporter: {
            reporters: [{
                type: 'html', //produces a html document after code is run
                subdir: 'client'
            }, {
                type: 'json',
                subdir: '.',
                file: 'client-coverage.json'
            }],
            dir: 'coverage/' //path to created html doc
        },

        plugins: [
            require('karma-chai-plugins'),
            require('karma-chrome-launcher'),
            require('karma-coverage'),
            require('karma-firefox-launcher'),
            require('karma-mocha'),
            require('karma-mocha-reporter'),
            require('karma-phantomjs-launcher'),
            require('karma-phantomjs-shim'),
            require('karma-script-launcher'),
            require('karma-webpack'),
        ],

        // list of files / patterns to exclude
        exclude: [],

        // web server port
        port: 8080,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['PhantomJS'],

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};
