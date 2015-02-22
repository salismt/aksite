'use strict';

angular.module('aksiteApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('admin.featured', {
                url: '/featured',
                templateUrl: 'app/admin/featuredManager/featuredManager.html',
                controller: 'FeaturedmanagerCtrl'
            });
    });
