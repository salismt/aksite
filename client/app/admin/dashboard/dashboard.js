'use strict';

angular.module('aksiteApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('admin.dashboard', {
                url: '',
                templateUrl: 'app/admin/dashboard/dashboard.html',
                controller: 'DashboardCtrl'
            });
    });
