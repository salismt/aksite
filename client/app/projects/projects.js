'use strict';

angular.module('aksiteApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('projects', {
                url: '/projects',
                templateUrl: 'app/projects/projects.html',
                controller: 'ProjectsCtrl',
                onEnter: function($rootScope) {
                    $rootScope.title = $rootScope.titleRoot + ' | Projects';
                }
            })
            .state('projects.project', {
                url: '/:projectId',
                templateUrl: 'app/projects/project/project.html',
                controller: 'ProjectCtrl'
            });
    });
