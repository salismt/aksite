'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var PhotoSchema = new Schema({
	name: String,
	info: String,
	hidden: Boolean,
    sourceUri: String,
    dateAdded: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Photo', PhotoSchema);