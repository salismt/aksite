'use strict';

export default function routes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('admin.projects', {
            url: '/projects',
            template: require('./projectManager.html'),
            controller: 'ProjectManagerController',
            controllerAs: 'vm'
        });
}
