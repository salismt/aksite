'use strict';

angular.module('aksiteApp')
    .controller('ResumeCtrl', function($scope, $http) {
        $http.get('/assets/linkedin_profile.json')
            .success(function(data) {
                console.log(data);
                $scope.profile = data;
            })
            .error(function(err) {
                console.log(err);
            });
    });
