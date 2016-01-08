import angular from 'angular';
import uirouter from 'angular-ui-router';

import project from './project';

import routing from './projects.routes';
import ProjectsController from './projects.controller';

//import '!raw!sass!./projects.scss';

export default angular.module('aksiteApp.projects', [uirouter, project])
    .config(routing)
    .controller('ProjectsController', ProjectsController)
    .name;
