'use strict';

angular.module('aksiteApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('photoManager', {
                url: '/admin/photos',
                templateUrl: 'app/admin/photoManager/photoManager.html',
                controller: 'PhotomanagerCtrl'
            });
    });
