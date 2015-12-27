import angular from 'angular';

import routing from './projectManager.routes';
import ProjectManagerController from './projectManager.controller';

//import '!raw!sass!./projectManager.scss';

export default angular.module('aksiteApp.admin.projectManager', [])
    .config(routing)
    .controller('ProjectManagerController', ProjectManagerController)
    .name;
