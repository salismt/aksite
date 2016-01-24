'use strict';

export default function routes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('newPost', {
            url: '/admin/blog/post-editor',
            template: require('./postEditor.html'),
            controller: 'PostEditorController',
            controllerAs: 'vm'
        })
        .state('postEditor', {
            url: '/admin/blog/post-editor/:postId',
            template: require('./postEditor.html'),
            controller: 'PostEditorController',
            controllerAs: 'vm'
        });
}
