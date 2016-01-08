import angular from 'angular';
import uirouter from 'angular-ui-router';

import timeline from '../../components/timeline';

import routing from './resume.routes';
import ResumeController from './resume.controller';

//import '!raw!sass!./resume.scss';

export default angular.module('aksiteApp.resume', [uirouter, timeline])
    .config(routing)
    .controller('ResumeController', ResumeController)
    .name;
