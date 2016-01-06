'use strict';

export default function routes($stateProvider) {
    'ngInject';
    'ngInject';
    $stateProvider
        .state('main', {
            url: '/',
            template: require('./main.html'),
            controller: 'MainController',
            controllerAs: 'main'
        });
}
