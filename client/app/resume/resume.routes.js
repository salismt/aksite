'use strict';

export default function routes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('resume', {
            abstract: true,
            url: '/resume',
            template: require('./resume.html'),
            controller: 'ResumeController',
            controllerAs: 'vm',
            onEnter: function($rootScope) {
                $rootScope.title = $rootScope.titleRoot + ' | Résumé';
            }
        });
}
