'use strict';

export default function routes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('admin.settings', {
            url: '/settings',
            template: require('./siteSettings.html'),
            controller: 'SiteSettingsController',
            controllerAs: 'vm'
        });
}
