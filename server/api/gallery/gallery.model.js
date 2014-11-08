'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GallerySchema = new Schema({
    name: String,
    info: String,
    date: Date,
    active: Boolean,
    photos: [String],
    featuredId: String,
    metadata : {}
});

module.exports = mongoose.model('Gallery', GallerySchema);
