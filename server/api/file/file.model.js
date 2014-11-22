'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FileSchema = new Schema({
    name: String,
    info: String,
    hidden: Boolean
});

module.exports = mongoose.model('File', FileSchema);
