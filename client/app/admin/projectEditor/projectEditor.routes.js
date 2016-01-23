'use strict';

export default function routes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('newProject', {
            url: '/admin/projects/project-editor',
            template: require('./projectEditor.html'),
            controller: 'ProjectEditorController',
            controllerAs: 'vm'
        })
        .state('projectEditor', {
            url: '/admin/projects/project-editor/:projectId',
            template: require('./projectEditor.html'),
            controller: 'ProjectEditorController',
            controllerAs: 'vm'
        });
}
