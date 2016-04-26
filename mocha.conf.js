'use strict';
/*eslint-env node*/

// Register the Babel require hook
require('babel-register');

var chai = require('chai');
var should = require('should');

// Load Chai assertions
// global.expect = chai.expect;
global.assert = chai.assert;
global.should = should;
// chai.Should();

// Load Sinon
global.sinon = require('sinon');

// Initialize Chai plugins
// chai.use(require('sinon-chai'));
// chai.use(require('chai-as-promised'));
// chai.use(require('chai-things'));
