import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './resume.routes';
import ResumeController from './resume.controller';

import main from './main';

//import '!raw!sass!./resume.scss';

export default angular.module('aksiteApp.resume', [
    uirouter,
    main
])
    .config(routing)
    .controller('ResumeController', ResumeController)
    .name;
