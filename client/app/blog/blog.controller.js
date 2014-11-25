'use strict';

angular.module('aksiteApp')
    .controller('BlogCtrl', function($scope, $http) {
        $scope.page = 1;

        $scope.posts = [];
        $http.get('api/posts')
            .success(function(posts) {
                $scope.posts = posts;
                console.log($scope.posts);
            })
            .error(function(err) {
                console.log(err);
            });
    });
