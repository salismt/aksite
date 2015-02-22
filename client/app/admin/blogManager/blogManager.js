'use strict';

angular.module('aksiteApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('admin.blog', {
                url: '/blog',
                templateUrl: 'app/admin/blogManager/blogManager.html',
                controller: 'BlogmanagerCtrl'
            });
    });
