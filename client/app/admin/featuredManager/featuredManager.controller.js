'use strict';

angular.module('aksiteApp')
    .controller('FeaturedmanagerCtrl', function($scope, $http) {
        $scope.newFeaturedSection = function() {
            $http.get('/api/featured/new')
                .success(function(data, status, headers, config) {
                    console.log(status);
                });
        };
    });
