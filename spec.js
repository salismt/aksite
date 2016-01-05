var testsContext;

require('babel-core/polyfill');
require('angular');
require('angular-mocks');

require('./client/app/app');

testsContext = require.context('./client', true, /\.spec\.js$/);
testsContext.keys().forEach(testsContext);
