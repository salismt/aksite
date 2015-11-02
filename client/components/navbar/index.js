/**
 * Created by Awk34 on 11/1/2015.
 */

import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './main.routes';
import MainController from './main.controller';

export default angular.module('aksiteApp.main', [uirouter])
    .config(routing)
    .controller('MainController', MainController)
    .name;
