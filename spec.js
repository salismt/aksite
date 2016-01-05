var testsContext;

var _ = require('lodash');
require('babel-core/polyfill');
require('angular');
require('angular-mocks');

require('./client/app/app');

testsContext = require.context('./client', true, /(?!bower_components)\.spec\.js$/);

// I SUCK AT REGEX SO I'M DOING THIS SHIT MANUALLY
var keys = testsContext.keys();
keys = _.filter(keys, function(key) {
    return key.indexOf('bower_components') === -1;
});

keys.forEach(testsContext);
