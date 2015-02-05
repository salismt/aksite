'use strict';

angular.module('aksiteApp')
    .controller('LoginCtrl', function($scope, Auth, $location, $window) {
        $scope.user = {};
        $scope.errors = {};

        $scope.login = function() {
            $scope.submitted = true;

            Auth.login({
                email: $scope.user.email,
                password: $scope.user.password
            })
                .then(function() {
                    // Logged in, redirect to home
                    $location.path('/');
                })
                .catch(function(err) {
                    $scope.errors.other = err.message;
                });
        };

        $scope.loginOauth = function(provider) {
            $window.location.href = '/auth/' + provider;
        };
    });
