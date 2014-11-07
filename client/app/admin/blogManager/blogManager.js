'use strict';

angular.module('aksiteApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('blogManager', {
                url: '/admin/blog',
                templateUrl: 'app/admin/blogManager/blogManager.html',
                controller: 'BlogmanagerCtrl'
            });
    });
