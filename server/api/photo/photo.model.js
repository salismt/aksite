'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PhotoSchema = new Schema({
    name: String,
    info: String,
    hidden: Boolean,
    featured: Boolean,
    fileId: String,
    thumbnailId: String,
    sqThumbnailId: String,
    metadata: {}
});

module.exports = mongoose.model('Photo', PhotoSchema);
