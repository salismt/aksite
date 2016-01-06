'use strict';

export default function routes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('newGallery', {
            url: '/admin/photos/gallery-editor',
            template: require('./galleryEditor.html'),
            controller: 'GalleryEditorController'
        })
        .state('galleryEditor', {
            url: '/admin/photos/gallery-editor/:galleryId',
            template: require('./galleryEditor.html'),
            controller: 'GalleryEditorController'
        });
}
