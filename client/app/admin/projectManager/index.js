import angular from 'angular';

import ProjectManagerController from './projectManager.controller';

//import '!raw!sass!./projectManager.scss';

export default angular.module('aksiteApp.admin.projectManager', [])
    .controller('ProjectManagerController', ProjectManagerController)
    .name;
