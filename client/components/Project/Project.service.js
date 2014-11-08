'use strict';

angular.module('aksiteApp')
    .service('Project', function Auth($resource) {
        return $resource('/api/projects/:id/:controller', {
            id: '@_id'
        });
    });
