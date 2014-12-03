'use strict';

angular.module('aksiteApp')
    .controller('PostCtrl', function($scope, $stateParams, $http) {
        $scope.postId = $stateParams.postId;

        $http.get('api/posts/'+$scope.postId)
            .success(function(post) {
                $scope.post = post;
                console.log($scope.post);
            })
            .error(function(err) {
                console.log(err);
            });
    });
