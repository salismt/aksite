'use strict';

angular.module('aksiteApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('newPost', {
                url: '/admin/blog/post-editor',
                templateUrl: 'app/admin/postEditor/postEditor.html',
                controller: 'PostEditorCtrl'
            })
            .state('postEditor', {
                url: '/admin/blog/post-editor/:postId',
                templateUrl: 'app/admin/postEditor/postEditor.html',
                controller: 'PostEditorCtrl'
            });
    });
