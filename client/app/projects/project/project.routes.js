'use strict';

export default function routes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('project', {
            url: '/projects/:projectId',
            template: require('./project.html'),
            controller: 'ProjectController',
            controllerAs: 'vm',
            onEnter: function($rootScope) {
                $rootScope.title = $rootScope.titleRoot + ' | Projects';
            }
        });
}
