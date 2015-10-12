'use strict';

angular.module('aksiteApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'app/account/login/login.html',
                controller: 'LoginController',
                controllerAs: 'vm',
                onEnter: function($rootScope) {
                    $rootScope.title = $rootScope.titleRoot + ' | Login';
                }
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'app/account/signup/signup.html',
                controller: 'SignupController',
                controllerAs: 'vm',
                onEnter: function($rootScope) {
                    $rootScope.title = $rootScope.titleRoot + ' | Signup';
                }
            })
        ;
    });
