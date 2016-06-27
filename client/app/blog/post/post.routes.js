'use strict';

export default function routes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('post', {
            url: '/blog/post/:postId',
            template: '<post></post>',
            onEnter: function($rootScope) {
                $rootScope.title = `${$rootScope.titleRoot} | Blog`;
            }
        });
}
