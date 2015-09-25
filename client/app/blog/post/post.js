'use strict';

angular.module('aksiteApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('post', {
                url: '/blog/post/:postId',
                templateUrl: 'app/blog/post/post.html',
                controller: 'PostCtrl',
                controllerAs: 'vm',
                onEnter: function($rootScope) {
                    $rootScope.title = $rootScope.titleRoot + ' | Blog';
                }
            });
    });
