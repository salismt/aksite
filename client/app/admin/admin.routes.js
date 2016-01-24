'use strict';

export default function routes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('admin', {
            abstract: true,
            url: '/admin',
            template: require('./admin.html'),
            controller: 'AdminController',
            controllerAs: 'admin',
            onEnter: function($rootScope) {
                $rootScope.title = $rootScope.titleRoot + ' | Admin';
            }
        });
}
