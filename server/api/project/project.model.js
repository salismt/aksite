'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProjectSchema = new Schema({
    name: String,
    info: String,
    active: Boolean,
    thumbnailId: String,
    coverPhotoId: String,
    link: String
});

module.exports = mongoose.model('Project', ProjectSchema);
