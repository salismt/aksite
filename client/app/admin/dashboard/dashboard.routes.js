'use strict';

export default function routes($stateProvider) {
    $stateProvider
        .state('admin.dashboard', {
            url: '',
            template: require('./dashboard.html'),
            controller: 'DashboardController'
        });
}
