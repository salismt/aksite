'use strict';

angular.module('aksiteApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('admin.settings', {
                url: '/settings',
                templateUrl: 'app/admin/siteSettings/siteSettings.html',
                controller: 'SitesettingsCtrl'
            });
    });
