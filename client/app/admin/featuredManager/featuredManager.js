'use strict';

angular.module('aksiteApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('featuredManager', {
                url: '/admin/featured',
                templateUrl: 'app/admin/featuredManager/featuredManager.html',
                controller: 'FeaturedmanagerCtrl'
            });
    });
