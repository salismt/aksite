'use strict';

angular.module('aksiteApp')
    .controller('PhotomanagerCtrl', function($scope, $http) {
        $scope.errors = {};
        $scope.loadingGalleries = true;

        $http.get('/api/gallery')
            .success(function(res, status) {
                $scope.galleries = res;
            })
            .error(function(res, status) {
                console.log(res);
                console.log(status);
            })
            .finally(function() {
                $scope.loadingGalleries = false;
            });
    });
