'use strict';

export default function routes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('resume', {
            url: '/resume',
            template: require('./resume.html'),
            controller: 'ResumeController',
            controllerAs: 'vm'
        });
}
