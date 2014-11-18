'use strict';

angular.module('aksiteApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('galleryEditor', {
                url: '/admin/photos/galleryEditor',
                templateUrl: 'app/admin/galleryEditor/galleryEditor.html',
                controller: 'GalleryEditorCtrl'
            });
    });
