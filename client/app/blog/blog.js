'use strict';

angular.module('aksiteApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('blog', {
                url: '/blog',
                templateUrl: 'app/blog/blog.html',
                controller: 'BlogCtrl'
            })
            .state('blog.post', {
                url: '/:postId',
                templateUrl: 'app/blog/post/post.html',
                controller: 'PostCtrl'
            });
    });
