'use strict';

export default function routes($stateProvider) {
    $stateProvider
        .state('admin.photos', {
            url: '/photos',
            template: require('./photoManager.html'),
            controller: 'PhotoManagerController'
        });
}
