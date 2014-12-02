'use strict';

angular.module('aksiteApp')
    .controller('BlogCtrl', function($scope, $http) {
        $scope.page = 1;

        $scope.posts = [];
        $http.get('api/posts')
            .success(function(posts) {
                $scope.posts = posts;
                _.forEach($scope.posts, function(post) {
                    post.localeDate = new Date(post.date).toLocaleString();
                    post.subheader = marked(post.subheader);
                });
                console.log($scope.posts);
            })
            .error(function(err) {
                console.log(err);
            });
    });
