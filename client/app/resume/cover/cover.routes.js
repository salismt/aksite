'use strict';

export default function routes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('resume.cover', {
            url: '/cover',
            template: require('./cover.html'),
            controller: 'CoverController',
            controllerAs: 'vm'
        });
}
