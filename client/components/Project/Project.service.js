'use strict';
import angular from 'angular';
import ngResource from 'angular-resource';

class Project {
    /*@ngInject*/
    constructor($resource) {
        return $resource('/api/projects/:id/:controller', {
            id: '@_id'
        });
    }
}

export default angular.module('services.Project', [ngResource])
    .service('Project', Project);
