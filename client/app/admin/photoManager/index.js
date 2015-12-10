import angular from 'angular';

import routing from './photoManager.routes';
import PhotoManagerController from './photoManager.controller';

//import '!raw!sass!./photoManager.scss';

export default angular.module('aksiteApp.admin.photoManager', [])
    .config(routing)
    .controller('PhotoManagerController', PhotoManagerController)
    .name;
