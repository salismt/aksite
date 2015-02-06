'use strict';

angular.module('aksiteApp')
    .controller('SignupCtrl', function($scope, Auth, $location, $window) {
        $scope.user = {};
        $scope.errors = {};

        $scope.register = function() {
            $scope.submitted = true;

            Auth.createUser({
                name: $scope.user.name,
                email: $scope.user.email,
                password: $scope.user.password
            })
                .then(function() {
                    $location.path('/');
                })
                .catch(function(err) {
                    $scope.errors = err;
                });
        };

        $scope.loginOauth = function(provider) {
            $window.location.href = '/auth/' + provider;
        };
    });
