'use strict';

export default function routes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('post', {
            url: '/blog/post/:postId',
            template: require('./post.html'),
            controller: 'PostController',
            controllerAs: 'vm',
            onEnter: function($rootScope) {
                $rootScope.title = $rootScope.titleRoot + ' | Blog';
            }
        });
}

