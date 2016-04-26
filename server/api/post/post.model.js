'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PostSchema = new Schema({
    title: String,
    subheader: String,
    alias: String,
    hidden: Boolean,
    author: {
        name: String,
        id: Schema.ObjectId,
        imageId: Schema.ObjectId,
        smallImageId: Schema.ObjectId
    },
    date: Date,
    imageId: Schema.ObjectId,
    thumbnailId: Schema.ObjectId,
    content: String,
    categories: [String]
});

/**
 * Validations
 */

// Validate empty email
PostSchema
    .path('title')
    .validate(function(title) {
        if(!title) {
            return false;
        }
        return title.length;
    }, 'Title cannot be blank');

module.exports = mongoose.model('Post', PostSchema);
