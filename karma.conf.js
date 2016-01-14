// Karma configuration
// http://karma-runner.github.io/0.13/config/configuration-file.html

import _ from 'lodash';
import path from 'path';

let include = [
    path.resolve('./client')
];

module.exports = function(config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['mocha', 'chai', 'sinon-chai', 'chai-as-promised', 'chai-things'],
        reporters: ['mocha', 'coverage'],

        files: [
            'spec.js'
        ],

        preprocessors: {
            'spec.js': ['webpack', 'sourcemap']
        },

        //TODO: move all to webpack.make.js
        webpack: {
            // karma watches the test entry points
            // (you don't need to specify the entry option)
            // webpack watches dependencies

            // webpack configuration
            resolve: {
                modulesDirectories: [
                    'node_modules'
                ],
                extensions: ['', '.js', '.ts']
            },
            devtool: 'inline-source-map',
            module: {
                loaders: [
                    {test: /\.html$/, loader: 'raw'},
                    {test: /\.js$/, loader: 'babel', exclude: /(node_modules)/, include, query: {
                        //presets: ['es2015'],
                        optional: [
                            'runtime',
                            'es7.classProperties'
                        ]
                    }},
                    {test: /\.js$/, loader: 'ng-annotate?single_quotes'},
                    // Process all non-test code with Isparta
                    //{test: /\.js$/, loader: 'isparta', include: include, exclude: /\.spec\.js$/},
                    //{test: /\.(png|woff|ttf)(\?.*)?$/, loader: 'url-loader?limit=1000000'},
                    {test: /\.scss$/, loaders: ['style', 'css', 'sass']},
                    {
                        // ASSET LOADER
                        // Reference: https://github.com/webpack/file-loader
                        // Copy png, jpg, jpeg, gif, svg, woff, woff2, ttf, eot files to output
                        // Rename the file using the asset hash
                        // Pass along the updated reference to your code
                        // You can add here any file extension you want to get copied to your output
                        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
                        loader: 'file'
                    }
                ],
                postLoaders: [{
                    //delays coverage til after tests are run, fixing transpiled source coverage error
                    test: /\.js$/,
                    exclude: /(node_modules)/,
                    loader: 'istanbul-instrumenter'
                }]
            },

            // Sass loader configuration to tell webpack where to find the additional SASS files
            // https://github.com/jtangelder/sass-loader#sass-options
            sassLoader: {
                includePaths: _.union(
                    [path.resolve(__dirname, 'node_modules', 'client')],
                    require('bourbon').includePaths
                )
            },
            stats: {colors: true, reasons: true},
            debug: false
        },

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
            require('karma-sourcemap-loader'),
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
