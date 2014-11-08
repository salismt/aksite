'use strict';

angular.module('aksiteApp')
    .factory('Gallery', function Auth($resource) {
        return $resource('/api/gallery/:id/:controller', {
            id: '@_id'
        });
    });
