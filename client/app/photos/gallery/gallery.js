'use strict';

angular.module('aksiteApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('gallery', {
                url: '/photos/:galleryId',
                templateUrl: 'app/photos/gallery/gallery.html',
                controller: 'GalleryCtrl'
            });
    });
