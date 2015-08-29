'use strict';

angular.module('aksiteApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('admin.files', {
                url: '/files',
                templateUrl: 'app/admin/fileManager/fileManager.html',
                controller: 'FileManagerController',
                controllerAs: 'fileManager'
            });
    });
