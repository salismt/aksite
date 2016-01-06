'use strict';

export default function routes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('blog', {
            url: '/blog?page&pagesize',
            template: require('./blog.html'),
            controller: 'BlogController',
            controllerAs: 'vm',
            onEnter: function($rootScope) {
                $rootScope.title = $rootScope.titleRoot + ' | Blog';
            }
        })
        .state('blog.post', {
            url: '/:postId',
            template: require('./post/post.html'),
            controller: 'PostController',
            controllerAs: 'vm'
        });
}
