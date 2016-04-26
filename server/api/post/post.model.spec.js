'use strict';
/*eslint-env mocha*/

import Post from './post.model';

var post;

var genPost = function() {
    post = new Post({
        title: 'Test Title',
        subheader: 'test subheader',
        alias: 'test-alias',
        hidden: false,
        // author: {
        //     name: String,
        //     id: Schema.ObjectId,
        //     imageId: Schema.ObjectId,
        //     smallImageId: Schema.ObjectId
        // },
        date: Date.now(),
        // imageId: Schema.ObjectId,
        // thumbnailId: Schema.ObjectId,
        content: 'Test Content',
        categories: ['catA']
    });
    return post;
};

describe('Post Model', function() {
    before(function() {
        // Clear users before testing
        return Post.remove();
    });

    beforeEach(function() {
        genPost();
    });

    afterEach(function() {
        return Post.remove();
    });

    it('should begin with no posts', function() {
        return Post.find({}).exec().should.finally.have.length(0);
    });

    it('should fail when saving with a blank title', function() {
        post.title = '';
        return post.save().should.be.rejected();
    });
});
