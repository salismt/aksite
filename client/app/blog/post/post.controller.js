'use strict';

angular.module('aksiteApp')
    .controller('PostCtrl', function($rootScope, $scope, $stateParams, $http) {
        $scope.postId = $stateParams.postId;

        $http.get('api/posts/'+$scope.postId)
            .success(function(post) {
                $scope.post = post;

                $rootScope.title += ' | ' + post.title;

                $scope.post.content = marked($scope.post.content);
                $scope.post.date = moment($scope.post.date).format("LL");
            })
            .error(function(err) {
                console.log(err);
                $scope.error = err;
            });
    });
