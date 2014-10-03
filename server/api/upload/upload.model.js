'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var UploadSchema = new Schema({
	name: String,
	info: String,
	active: Boolean,
	file: {
		mime: String,
		bin: Buffer
	}
});

UploadSchema.methods.addFile = function(file, options, fn) {
	return gridfs.putFile(file.path, file.filename, options, (function(_this) {
		return function(err, result) {
			_this.files.push(result);
			return _this.save(fn);
		};
	})(this));
};

module.exports = mongoose.model('Upload', UploadSchema);