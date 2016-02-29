'use strict';
import { Converter } from 'showdown';
const converter = new Converter();

export default class ProjectController {
    project = {};

    /*@ngInject*/
    constructor($rootScope, $http, $stateParams) {
        this.projectId = $stateParams.projectId;

        $http.get('/api/projects/' + $stateParams.projectId)
            .then(({data: project}) => {
                this.project = project;

                $rootScope.title += ' | ' + project.name;

                this.content = converter.makeHtml(project.content);
            })
            .catch((res) => {
                this.error = res;
            });
    }
}
