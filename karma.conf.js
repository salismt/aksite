// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['mocha', 'chai', 'sinon-chai', 'chai-as-promised', 'chai-things'],

        // list of files / patterns to load in the browser
        files: [
            //'client/socket.io/socket.io.js',
            'client/bower_components/ng-file-upload/angular-file-upload-shim.js',
            'client/bower_components/marked/lib/marked.js',
            'client/bower_components/photoswipe/dist/photoswipe.js',
            'client/bower_components/photoswipe/dist/photoswipe-ui-default.min.js',
            'client/assets/js/highlight.pack.js',
            'client/assets/js/seedrandom.js',
            // bower:js
            'client/bower_components/modernizr/modernizr.js',
            'client/bower_components/angular/angular.js',
            'client/bower_components/angular-animate/angular-animate.js',
            'client/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
            'client/bower_components/angular-cookies/angular-cookies.js',
            'client/bower_components/get-style-property/get-style-property.js',
            'client/bower_components/get-size/get-size.js',
            'client/bower_components/eventie/eventie.js',
            'client/bower_components/doc-ready/doc-ready.js',
            'client/bower_components/eventEmitter/EventEmitter.js',
            'client/bower_components/matches-selector/matches-selector.js',
            'client/bower_components/outlayer/item.js',
            'client/bower_components/outlayer/outlayer.js',
            'client/bower_components/masonry/masonry.js',
            'client/bower_components/imagesloaded/imagesloaded.js',
            'client/bower_components/angular-masonry-directive/src/angular-masonry-directive.js',
            'client/bower_components/angular-mocks/angular-mocks.js',
            'client/bower_components/angular-aria/angular-aria.js',
            'client/bower_components/angular-material/angular-material.js',
            'client/bower_components/angular-messages/angular-messages.js',
            'client/bower_components/angular-resource/angular-resource.js',
            'client/bower_components/angular-sanitize/angular-sanitize.js',
            'client/bower_components/angular-socket-io/socket.js',
            'client/bower_components/angular-ui-router/release/angular-ui-router.js',
            'client/bower_components/classie/classie.js',
            'client/bower_components/d3/d3.js',
            'client/bower_components/es6-promise/promise.js',
            'client/bower_components/hammerjs/hammer.js',
            'client/bower_components/isotope/js/item.js',
            'client/bower_components/isotope/js/layout-mode.js',
            'client/bower_components/isotope/js/isotope.js',
            'client/bower_components/isotope/js/layout-modes/vertical.js',
            'client/bower_components/isotope/js/layout-modes/fit-rows.js',
            'client/bower_components/isotope/js/layout-modes/masonry.js',
            'client/bower_components/lodash/lodash.js',
            'client/bower_components/moment/moment.js',
            'client/bower_components/ng-file-upload/angular-file-upload.js',
            'client/bower_components/nvd3/build/nv.d3.js',
            'client/bower_components/photoswipe/dist/photoswipe.js',
            'client/bower_components/photoswipe/dist/photoswipe-ui-default.js',
            'client/bower_components/react/react.js',
            // endbower
            'node_modules/socket.io/node_modules/socket.io-client/socket.io.js',
            'client/app/app.js',
            'client/app/**/*.js',
            'client/components/**/*.js',
            'client/app/**/*.html',
            'client/components/**/*.html'
        ],

        preprocessors: {
            '**/*.html': 'html2js',
            'client/{app,components}/**/*.js': 'babel'
        },

        ngHtml2JsPreprocessor: {
            stripPrefix: 'client/'
        },

        babelPreprocessor: {
            options: {
                sourceMap: 'inline'
            },
            filename: function (file) {
                return file.originalPath.replace(/\.js$/, '.es5.js');
            },
            sourceFileName: function (file) {
                return file.originalPath;
            }
        },

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
