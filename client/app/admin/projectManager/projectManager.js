'use strict';

angular.module('aksiteApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('projectManager', {
                url: '/admin/projects',
                templateUrl: 'app/admin/projectManager/projectManager.html',
                controller: 'ProjectmanagerCtrl'
            });
    });
