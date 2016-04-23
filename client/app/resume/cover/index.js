import angular from 'angular';

import routing from './cover.routes';
import CoverController from './cover.controller.js';

import timeline from '../../../components/timeline';

//import '!raw!sass!./cover.scss';

export default angular.module('aksiteApp.resume.cover', [timeline])
    .config(routing)
    .controller('CoverController', CoverController)
    .name;
