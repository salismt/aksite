'use strict';

angular.module('aksiteApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('newGallery', {
                url: '/admin/photos/gallery-editor',
                templateUrl: 'app/admin/galleryEditor/galleryEditor.html',
                controller: 'GalleryEditorCtrl'
            })
            .state('galleryEditor', {
                url: '/admin/photos/gallery-editor/:galleryId',
                templateUrl: 'app/admin/galleryEditor/galleryEditor.html',
                controller: 'GalleryEditorCtrl'
            });
    });
