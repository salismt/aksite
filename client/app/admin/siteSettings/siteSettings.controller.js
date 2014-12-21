'use strict';

angular.module('aksiteApp')
    .controller('SitesettingsCtrl', function($scope, $http) {
        $scope.cleanOrphans = function() {
            $http.get('/api/upload/clean')
                .success(function(data, status/*, headers, config*/) {
                    console.log(status);
                    console.log(data);
                })
                .error(function(data, status/*, headers, config*/) {
                    console.log(status);
                    console.log(data);
                });
        };
    });
