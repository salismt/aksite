'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PostSchema = new Schema({
    name: String,
    info: String,
    hidden: Boolean
});

module.exports = mongoose.model('Post', PostSchema);
