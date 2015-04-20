'use strict';

angular.module('aksiteApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('project', {
                url: '/projects/:projectId',
                templateUrl: 'app/projects/project/project.html',
                controller: 'ProjectCtrl',
                onEnter: function($rootScope) {
                    $rootScope.title = $rootScope.titleRoot + ' | Projects';
                }
            });
    });
