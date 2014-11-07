'use strict';

angular.module('aksiteApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('userManager', {
                url: '/admin/users',
                templateUrl: 'app/admin/userManager/userManager.html',
                controller: 'UsermanagerCtrl'
            });
    });
