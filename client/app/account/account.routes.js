'use strict';

export default function routes($stateProvider) {
    'ngInject';
    $stateProvider.state('login', {
        url: '/login',
        template: require('./login/login.html'),
        controller: 'LoginController',
        controllerAs: 'vm',
        onEnter: function($rootScope) {
            $rootScope.title = $rootScope.titleRoot + ' | Login';
        }
    }).state('signup', {
        url: '/signup',
        template: require('./signup/signup.html'),
        controller: 'SignupController',
        controllerAs: 'vm',
        onEnter: function($rootScope) {
            $rootScope.title = $rootScope.titleRoot + ' | Signup';
        }
    });
}
