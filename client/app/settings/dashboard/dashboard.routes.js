'use strict';

export default function routes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('settings.dashboard', {
            url: '',
            template: require('./dashboard.html'),
            controller: 'SettingsDashboardController',
            controllerAs: 'dash'
        });
}
