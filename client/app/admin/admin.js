'use strict';

angular.module('aksiteApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('admin', {
                url: '/admin',
                templateUrl: 'app/admin/admin.html',
                controller: 'AdminCtrl'
            })
            .state('photosManager', {
                url: '/admin/photos',
                templateUrl: 'app/admin/photosManager/photosManager.html',
                controller: 'PhotosManagerCtrl'
            });
    });