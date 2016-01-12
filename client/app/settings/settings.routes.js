'use strict';

export default function routes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('settings', {
            abstract: true,
            url: '/settings',
            template: require('./settings.html'),
            controller: 'SettingsController',
            onEnter: function($rootScope) {
                $rootScope.title = $rootScope.titleRoot + ' | Settings';
            }
        });
}
