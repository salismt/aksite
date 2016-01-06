'use strict';

export default function routes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('admin.galleries', {
            url: '/galleries',
            template: require('./galleryManager.html'),
            controller: 'GalleryManagerController'
        });
}
