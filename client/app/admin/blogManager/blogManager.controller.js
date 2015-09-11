'use strict';

angular.module('aksiteApp')
    .controller('BlogmanagerCtrl', function($scope, $http, $state) {
        $scope.errors = [];
        $scope.loadingPosts = true;
        $scope.posts = [];
        $scope.postDeletions = [];
        $scope.postChanges = [];
        $scope.dirty = false;

        $http.get('/api/posts')
            .success(function(res) {
                $scope.posts = res.items;
                $scope.page = res.page;
                $scope.pages = res.pages;
                $scope.items = res.numItems;
                console.log(res);
            })
            .error(function(res, status) {
                console.log(res);
                console.log(status);
            })
            .finally(function() {
                $scope.loadingPosts = false;
            });

        $scope.goToPost = function(id/*, event*/) {
            $state.go('postEditor', {postId: id});
        };

        //TODO: remove strange toggling, change to immediately delete, but show a 'Post Deleted' toast with an 'UNDO' button
        $scope.togglePostDeletion = function(post) {
            if(!post.deleted) {
                post.deleted = true;
                $scope.dirty = true;
                $scope.postDeletions.push(post);
            } else {
                post.deleted = false;
                _.remove($scope.postDeletions, function(thisPost) {
                    return thisPost._id === post._id;
                });
                if($scope.postDeletions.length === 0) {
                    $scope.dirty = false;
                }
            }
        };

        $scope.saveChanges = function() {
            // Delete posts
            _.forEach($scope.postDeletions, function(post) {
                $http.delete('/api/posts/'+post._id)
                    .success(function(res, status) {
                        _.remove($scope.posts, post);
                        $scope.dirty = false;
                        console.log(res);
                        console.log(status);
                    })
                    .error(function(res, status) {
                        console.log(res);
                        console.log(status);
                    });
            });
        };
    });
