'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PostSchema = new Schema({
    title: String,
    alias: String,
    hidden: Boolean,
    author: String,
    date: Date,
    imageId: String,
    content: String,
    categories: [String]
});

module.exports = mongoose.model('Post', PostSchema);
