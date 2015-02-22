'use strict';

angular.module('aksiteApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('admin.photos', {
                url: '/photos',
                templateUrl: 'app/admin/photoManager/photoManager.html',
                controller: 'PhotomanagerCtrl'
            });
    });
