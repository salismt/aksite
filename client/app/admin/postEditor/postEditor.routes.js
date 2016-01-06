'use strict';

export default function routes($stateProvider) {
    $stateProvider
        .state('newPost', {
            url: '/admin/blog/post-editor',
            template: require('./postEditor.html'),
            controller: 'PostEditorController'
        })
        .state('postEditor', {
            url: '/admin/blog/post-editor/:postId',
            template: require('./postEditor.html'),
            controller: 'PostEditorController'
        });
}
