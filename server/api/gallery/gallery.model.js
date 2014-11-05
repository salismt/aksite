'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GallerySchema = new Schema({
    name: String,
    info: String,
    date: Date,
    active: Boolean,
    photos: [{}],
    featured: {}
});

module.exports = mongoose.model('Gallery', GallerySchema);
