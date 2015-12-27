'use strict';

export default function routes($stateProvider) {
    $stateProvider
        .state('admin.settings', {
            url: '/settings',
            template: require('./siteSettings.html'),
            controller: 'SiteSettingsController'
        });
}
