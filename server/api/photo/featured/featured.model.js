'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FeaturedSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Featured', FeaturedSchema);