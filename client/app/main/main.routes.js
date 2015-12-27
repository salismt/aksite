'use strict';

export default function routes($stateProvider) {
    $stateProvider
        .state('main', {
            url: '/',
            template: require('./main.html'),
            controller: 'MainController',
            controllerAs: 'main'
        });
}
