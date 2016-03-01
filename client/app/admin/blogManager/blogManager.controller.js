'use strict';
import _ from 'lodash-es';

export default class BlogManagerController {
    errors = [];
    loadingPosts = true;
    posts = [];
    postDeletions = [];
    postChanges = [];
    dirty = false;

    /*@ngInject*/
    constructor($http, $state) {
        this.$http = $http;
        this.$state = $state;

        $http.get('/api/posts')
            .success(res => {
                this.posts = res.items;
                this.page = res.page;
                this.pages = res.pages;
                this.items = res.numItems;
                console.log(res);
            })
            .error((res, status) => {
                console.log(res);
                console.log(status);
            })
            .finally(() => {
                this.loadingPosts = false;
            });
    }

    goToPost(id/*, event*/) {
        this.$state.go('postEditor', {postId: id});
    }

    //TODO: remove strange toggling, change to immediately delete, but show a 'Post Deleted' toast with an 'UNDO' button
    togglePostDeletion(post) {
        if(!post.deleted) {
            post.deleted = true;
            this.dirty = true;
            this.postDeletions.push(post);
        } else {
            post.deleted = false;
            _.remove(this.postDeletions, function(thisPost) {
                return thisPost._id === post._id;
            });
            if(this.postDeletions.length === 0) {
                this.dirty = false;
            }
        }
    }

    saveChanges() {
        // Delete posts
        _.forEach(this.postDeletions, post => {
            this.$http.delete('/api/posts/' + post._id)
                .success((res, status) => {
                    _.remove(this.posts, post);
                    this.dirty = false;
                    console.log(res);
                    console.log(status);
                })
                .error((res, status) => {
                    console.log(res);
                    console.log(status);
                });
        });
    }
}
