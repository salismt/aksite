'use strict';

angular.module('aksiteApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('settings.dashboard', {
                url: '',
                templateUrl: 'app/settings/dashboard/dashboard.html',
                controller: 'SettingsDashboardController'
            });
    });
