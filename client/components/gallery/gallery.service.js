'use strict';
import angular from 'angular';
import ngResource from 'angular-resource';

class Gallery {
    /*@ngInject*/
    constructor($resource) {
        return $resource('/api/gallery/:id/:controller', {
            id: '@_id'
        });
    }
}

export default angular.module('services.Gallery', [ngResource])
    .service('Gallery', Gallery)
    .name;
