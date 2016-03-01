'use strict';
import angular from 'angular';

angular.module('aksiteApp')
    .factory('Photo', function Auth($resource) {
        return $resource('/api/photos/:id/:controller', {
            id: '@_id'
        });
    });
