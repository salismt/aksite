import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './main.routes';
import MainController from './main.controller';

//import '!raw!sass!./main.scss'

export default angular.module('aksiteApp.main', [uirouter])
    .config(routing)
    .controller('MainController', MainController)
    .name;
