'use strict';

export default function routes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('admin', {
            abstract: true,
            url: '/admin',
            template: require('./admin.html'),
            controller: 'AdminController',
            onEnter: function($rootScope) {
                $rootScope.title = $rootScope.titleRoot + ' | Admin';
            }
        });
}
