'use strict';

angular.module('aksiteApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('newProject', {
                url: '/admin/projects/project-editor',
                templateUrl: 'app/admin/projectEditor/projectEditor.html',
                controller: 'ProjectEditorCtrl'
            })
            .state('projectEditor', {
                url: '/admin/projects/project-editor/:projectId',
                templateUrl: 'app/admin/projectEditor/projectEditor.html',
                controller: 'ProjectEditorCtrl'
            });
    });
