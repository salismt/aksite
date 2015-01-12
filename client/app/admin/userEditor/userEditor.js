'use strict';

angular.module('aksiteApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('userEditor', {
                url: '/admin/users/:userId',
                templateUrl: 'app/admin/userEditor/userEditor.html',
                controller: 'UserEditorCtrl'
            });
    });
