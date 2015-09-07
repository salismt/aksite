'use strict';

angular.module('aksiteApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('user', {
                url: '/user/:id',
                templateUrl: 'app/user/user.html',
                controller: 'UserController',
                controllerAs: 'vm'
            });
    });
