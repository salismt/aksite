'use strict';

export default function routes($stateProvider) {
    $stateProvider
        .state('admin.blog', {
            url: '/blog',
            template: require('./blogManager.html'),
            controller: 'BlogManagerController'
        });
}
