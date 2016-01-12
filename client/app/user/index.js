import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './user.routes';
import UserController from './user.controller';

//import '!raw!sass!./user.scss';

export default angular.module('aksiteApp.user', [uirouter])
    .config(routing)
    .controller('UserController', UserController)
    .name;
