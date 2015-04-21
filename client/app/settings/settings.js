'use strict';

angular.module('aksiteApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('settings', {
                abstract: true,
                url: '/settings',
                templateUrl: 'app/settings/settings.html',
                controller: 'SettingsCtrl',
                onEnter: function($rootScope) {
                    $rootScope.title = $rootScope.titleRoot + ' | Settings';
                }
            });
    });
