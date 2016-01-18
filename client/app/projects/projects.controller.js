'use strict';

export default class ProjectsController {
    loadingProjects = true;

    /*@ngInject*/
    constructor(Project) {
        this.projects = Project.query(() => {
            this.loadingProjects = false;
        });
    }
}
