'use strict';

export default function routes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('admin.blog', {
            url: '/blog',
            template: require('./blogManager.html'),
            controller: 'BlogManagerController',
            controllerAs: 'vm'
        });
}
