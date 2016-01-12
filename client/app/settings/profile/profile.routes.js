'use strict';

export default function routes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('settings.profile', {
            url: '/profile',
            template: require('./profile.html'),
            controller: 'ProfileSettingsController'
        });
}
