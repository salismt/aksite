import angular from 'angular';
import uirouter from 'angular-ui-router';
import {Component} from '@angular/core';
import {upgradeAdapter} from '../../../app/upgrade_adapter';
import {Converter} from 'showdown';
const converter = new Converter();

import routes from './project.routes';

@Component({
    selector: 'project',
    template: require('./project.html'),
    styles: [require('!!raw!sass!./project.scss')]
})
export class ProjectComponent {
    error;
    project = {};

    static parameters = ['$rootScope', '$http', '$stateParams'];
    constructor($rootScope, $http, $stateParams) {
        this.$rootScope = $rootScope;
        this.$http = $http;
        this.$stateParams = $stateParams;

        this.projectId = $stateParams.projectId;
    }

    ngOnInit() {
        return this.$http.get(`/api/projects/${this.$stateParams.projectId}`)
            .then(({data: project}) => {
                this.project = project;

                this.$rootScope.title += ` | ${project.name}`;

                this.content = converter.makeHtml(project.content);
            })
            .catch(res => {
                this.error = res;
            });
    }
}

export default angular.module('aksiteApp.projects.project', [uirouter])
    .config(routes)
    .directive('project', upgradeAdapter.downgradeNg2Component(ProjectComponent))
    .name;
