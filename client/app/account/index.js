/**
 * Created by Awk34 on 11/7/2015.
 */
import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './account.routes';
//import MainController from './main.controller';
import login from './login';
import signup from './signup';

export default angular.module('aksiteApp.account', [
    uirouter,
    login,
    signup
])
    .config(routing)
    .name;
