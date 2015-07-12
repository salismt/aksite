// Protractor configuration
// https://github.com/angular/protractor/blob/master/referenceConf.js

'use strict';

exports.config = {
    // The timeout for each script run on the browser. This should be longer
    // than the maximum time your application needs to stabilize between tasks.
    allScriptsTimeout: 110000,

    // A base URL for your application under test. Calls to protractor.get()
    // with relative paths will be prepended with this.
    baseUrl: 'http://localhost:' + (process.env.PORT || '9000'),

    // If true, only chromedriver will be started, not a standalone selenium.
    // Tests for browsers other than chrome will not run.
    chromeOnly: false,

    // list of files / patterns to load in the browser
    specs: [
        'e2e/**/*.spec.js'
    ],

    // Patterns to exclude.
    exclude: [],

    // ----- Capabilities to be passed to the webdriver instance ----
    //
    // For a full list of available capabilities, see
    // https://code.google.com/p/selenium/wiki/DesiredCapabilities
    // and
    // https://code.google.com/p/selenium/source/browse/javascript/webdriver/capabilities.js
    capabilities: {
        'browserName': 'chrome'
    },

    // ----- The test framework -----
    //
    // Test framework to use. This may be one of:
    //  jasmine, jasmine2, cucumber, mocha or custom.
    //
    // Jasmine and Jasmine2 are fully supported as test and assertion frameworks.
    // Mocha and Cucumber have limited support. You will need to include your
    // own assertion framework (such as Chai) if working with Mocha.
    framework: 'jasmine2',

    // ----- Options to be passed to minijasminenode -----
    //
    // See the full list at https://github.com/juliemr/minijasminenode
    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000
    }
};
