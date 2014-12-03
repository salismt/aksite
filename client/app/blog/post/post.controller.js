'use strict';

angular.module('aksiteApp')
    .controller('PostCtrl', function($scope, $stateParams, $http) {
        $scope.postId = $stateParams.postId;

        $http.get('api/posts/'+$scope.postId)
            .success(function(post) {
                $scope.post = post;
                $scope.post.content = marked($scope.post.content);
                $scope.post.localeDate = new Date($scope.post.date).toLocaleString();
                console.log($scope.post);
            })
            .error(function(err) {
                console.log(err);
                $scope.error = err;
            });
    });
