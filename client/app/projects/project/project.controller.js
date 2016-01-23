'use strict';

import marked from 'marked';

export default class ProjectController {
    project = {};

    /*@ngInject*/
    constructor($rootScope, $http, $stateParams) {
        this.projectId = $stateParams.projectId;

        $http.get('/api/projects/' + $stateParams.projectId)
            .then(({data: project}) => {
                this.project = project;

                $rootScope.title += ' | ' + project.name;

                this.content = marked(project.content);
            })
            .then(({data, status}) =>{
                this.error = status;
            });
    }
}
