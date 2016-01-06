'use strict';

export default function routes($stateProvider) {
    $stateProvider
        .state('admin.galleries', {
            url: '/galleries',
            template: require('./galleryManager.html'),
            controller: 'GalleryManagerController'
        });
}
