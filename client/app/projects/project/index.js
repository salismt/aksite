import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './project.routes';
import ProjectController from './project.controller';

//import '!raw!sass!./project.scss';

export default angular.module('aksiteApp.projects.project', [uirouter])
    .config(routing)
    .controller('ProjectController', ProjectController)
    .name;
