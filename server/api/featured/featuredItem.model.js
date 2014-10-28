'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FeaturedItemSchema = new Schema({
    name: String,
    info: String,
    active: Boolean,
    thumbnailId: String,
    link: String,
    type: String
});

module.exports = mongoose.model('FeaturedItem', FeaturedItemSchema);
