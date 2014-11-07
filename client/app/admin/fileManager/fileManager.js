'use strict';

angular.module('aksiteApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('fileManager', {
                url: '/admin/files',
                templateUrl: 'app/admin/fileManager/fileManager.html',
                controller: 'FilemanagerCtrl'
            });
    });
