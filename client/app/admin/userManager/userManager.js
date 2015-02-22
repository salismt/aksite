'use strict';

angular.module('aksiteApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('admin.users', {
                url: '/users',
                templateUrl: 'app/admin/userManager/userManager.html',
                controller: 'UsermanagerCtrl'
            });
    });
