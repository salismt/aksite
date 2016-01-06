'use strict';

export default function routes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('admin.users', {
            url: '/users',
            template: require('./userManager.html'),
            controller: 'UserManagerController'
        });
}
