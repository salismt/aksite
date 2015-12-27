import angular from 'angular';

import routing from './fileManager.routes';
import FileManagerController from './fileManager.controller';

//import '!raw!sass!./fileManager.scss';

export default angular.module('aksiteApp.admin.fileManager', [])
    .config(routing)
    .controller('FileManagerController', FileManagerController)
    .name;
