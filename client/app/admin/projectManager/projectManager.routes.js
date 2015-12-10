'use strict';

export default function routes($stateProvider) {
    $stateProvider
        .state('admin.projects', {
            url: '/projects',
            template: require('./projectManager.html'),
            controller: 'ProjectManagerController'
        });
}
