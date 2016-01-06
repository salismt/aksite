'use strict';

export default function routes($stateProvider) {
    $stateProvider
        .state('newProject', {
            url: '/admin/projects/project-editor',
            template: require('./projectEditor.html'),
            controller: 'ProjectEditorController'
        })
        .state('projectEditor', {
            url: '/admin/projects/project-editor/:projectId',
            template: require('./projectEditor.html'),
            controller: 'ProjectEditorController'
        });
}
