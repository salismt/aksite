'use strict';

import angular from 'angular';
import ngResource from 'angular-resource';

/*@ngInject*/
function User($resource) {
    return $resource('/api/users/:id/:controller', {
        id: '@_id'
    }, {
        changePassword: {
            method: 'PUT',
            params: {
                controller: 'password'
            }
        },
        get: {
            method: 'GET',
            params: {
                id: 'me'
            }
        }
    });
}

export default angular.module('factories.User', [ngResource])
    .factory('User', User)
    .name;
