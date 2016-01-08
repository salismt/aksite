'use strict';

export default function routes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('gallery', {
            url: '/galleries/:galleryId',
            template: require('./gallery.html'),
            controller: 'GalleryController',
            onEnter: function($rootScope) {
                $rootScope.title = $rootScope.titleRoot + ' | Galleries';
            }
        });
}
