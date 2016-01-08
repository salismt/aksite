'use strict';

export default function routes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('projects', {
            url: '/projects',
            template: require('./projects.html'),
            controller: 'ProjectsController',
            onEnter: function($rootScope) {
                $rootScope.title = $rootScope.titleRoot + ' | Projects';
            }
        })
        .state('projects.project', {
            url: '/:projectId',
            template: require('./project/project.html'),
            controller: 'ProjectsController'
        });
}
