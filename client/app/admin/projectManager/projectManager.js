'use strict';

angular.module('aksiteApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('admin.projects', {
                url: '/projects',
                templateUrl: 'app/admin/projectManager/projectManager.html',
                controller: 'ProjectmanagerCtrl'
            });
    });
