'use strict';

angular.module('aksiteApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('settings.profile', {
                url: '',
                templateUrl: 'app/settings/profile/profile.html',
                controller: 'ProfileSettingsCtrl'
            });
    });
