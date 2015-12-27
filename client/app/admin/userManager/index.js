import angular from 'angular';

import routing from './userManager.routes';
import UserManagerController from './userManager.controller';

//import '!raw!sass!./userManager.scss';

export default angular.module('aksiteApp.admin.userManager', [])
    .config(routing)
    .controller('UserManagerController', UserManagerController)
    .name;
