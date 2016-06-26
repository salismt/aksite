import angular from 'angular';

import UserManagerController from './userManager.controller';

//import '!raw!sass!./userManager.scss';

export default angular.module('aksiteApp.admin.userManager', [])
    .controller('UserManagerController', UserManagerController)
    .name;
