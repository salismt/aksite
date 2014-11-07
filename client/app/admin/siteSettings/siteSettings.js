'use strict';

angular.module('aksiteApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('siteSettings', {
                url: '/admin/settings',
                templateUrl: 'app/admin/siteSettings/siteSettings.html',
                controller: 'SitesettingsCtrl'
            });
    });
