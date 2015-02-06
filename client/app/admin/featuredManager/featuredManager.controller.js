'use strict';

angular.module('aksiteApp')
    .controller('FeaturedmanagerCtrl', function($scope, $http) {
        $scope.loadingItems = true;
        $http.get('/api/featured/items')
            .success(function(data) {
                console.log(data);
                $scope.items = data;
            })
            .error(function(err, status) {
                console.log(err);
                console.log(status);
            });

        $scope.newFeaturedSection = function() {
            $http.get('/api/featured/new')
                .success(function(data, status) {
                    console.log(status);
                });
        };

        $scope.deleteItem = function(item) {
            //TODO
        };
    });
