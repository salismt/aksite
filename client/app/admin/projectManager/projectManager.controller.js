'use strict';

export default class ProjectManagerController {
    errors = [];
    loadingProjects = true;
    projects = [];
    projectDeletions = [];
    projectChanges = [];
    dirty = false;

    /*@ngInject*/
    constructor($http) {
        this.$http = $http;

        $http.get('/api/projects')
            .then(({data}) => {
                this.projects = data;
            })
            .catch((data, status) => {
                console.log(data);
                console.log(status);
            })
            .finally(() => {
                this.loadingProjects = false;
            });
    }

    toggleProjectDeletion(project) {
        if(!project.deleted) {
            project.deleted = true;
            this.dirty = true;
            this.projectDeletions.push(project);
        } else {
            project.deleted = false;
            _.remove(this.projectDeletions, thisProject =>  thisProject._id === project._id);
            if(this.projectDeletions.length === 0) {
                this.dirty = false;
            }
        }
    };

    saveChanges() {
        // Delete projects
        _.forEach(this.projectDeletions, project => {
            this.$http.delete('/api/projects/' + project._id)
                .then(({data, status}) => {
                    _.remove(this.projects, project);
                    this.dirty = false;
                    console.log(data);
                    console.log(status);
                })
                .catch(res => {
                    console.log(res);
                });
        });
    };
}
