/**
 * Created by Awk34 on 11/1/2015.
 */

export default function routing($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    'ngInject';
    $urlRouterProvider
        .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
}
