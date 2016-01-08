'use strict';

export default function routes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('galleries', {
            url: '/galleries',
            template: require('./galleries.html'),
            controller: 'GalleriesController',
            controllerAs: 'vm',
            onEnter: function($rootScope) {
                $rootScope.title = $rootScope.titleRoot + ' | Galleries';
            }
        })
        .state('galleries.gallery', {
            url: '/:galleryId',
            template: require('./gallery/gallery.html'),
            controller: 'GalleryController'
        });
}
