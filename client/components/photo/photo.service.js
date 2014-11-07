'use strict';

angular.module('aksiteApp')
    .factory('Photo', function Auth($resource) {
        return $resource('/api/photos/:id/:controller', {
            id: '@_id'
        });
    });
