'use strict';

export default function routes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('gallery', {
            url: '/galleries/:galleryId',
            template: require('./gallery.html'),
            controller: 'GalleryController',
            controllerAs: 'vm',
            onEnter: function($rootScope) {
                $rootScope.title = $rootScope.titleRoot + ' | Galleries';
            }
        });
}
