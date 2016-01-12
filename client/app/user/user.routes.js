'use strict';

export default function routes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('user', {
            url: '/user/:id',
            template: require('./user.html'),
            controller: 'UserController',
            controllerAs: 'vm'
        });
}
