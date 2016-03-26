import angular from 'angular';

import routing from './main.routes';
import MainController from './main.controller.js';

import timeline from '../../../components/timeline';

//import '!raw!sass!./main.scss';

export default angular.module('aksiteApp.resume.main', [timeline])
    .config(routing)
    .controller('MainController', MainController)
    .name;
