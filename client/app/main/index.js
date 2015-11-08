import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './main.routes';
import MainController from './main.controller';

import navbar from '../../components/navbar';

//import '!raw!sass!./main.scss'

export default angular.module('aksiteApp.main', [uirouter, navbar])
    .config(routing)
    .controller('MainController', MainController)
    .name;
