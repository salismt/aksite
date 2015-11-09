import angular from 'angular';

import LoginController from './login.controller';

export default angular.module('aksiteApp.login', [])
    .controller('LoginController', LoginController)
    .name;
