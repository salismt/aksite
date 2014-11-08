'use strict';

angular.module('aksiteApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('resume', {
                url: '/resume',
                templateUrl: 'app/resume/resume.html',
                controller: 'ResumeCtrl'
            });
    });
