'use strict';

angular.module('aksiteApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('blog', {
                url: '/blog?page&pagesize',
                templateUrl: 'app/blog/blog.html',
                controller: 'BlogController',
                controllerAs: 'vm',
                onEnter: function($rootScope) {
                    $rootScope.title = $rootScope.titleRoot + ' | Blog';
                }
            })
            .state('blog.post', {
                url: '/:postId',
                templateUrl: 'app/blog/post/post.html',
                controller: 'PostController',
                controllerAs: 'vm'
            });
    });
