'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProjectSchema = new Schema({
    name: String,
    info: String,
    content: String,
    active: Boolean,
    thumbnailId: String,
    coverId: String,
    link: String,
    date: Date
});

module.exports = mongoose.model('Project', ProjectSchema);
