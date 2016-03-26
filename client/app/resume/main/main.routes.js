'use strict';

export default function routes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('resume.main', {
            url: '/main',
            template: require('./main.html'),
            controller: 'MainController',
            controllerAs: 'vm'
        });
}
