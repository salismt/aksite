import angular from 'angular';
import uirouter from 'angular-ui-router';

import gallery from './gallery';

import routing from './galleries.routes';
import GalleriesController from './galleries.controller';

//import '!raw!sass!./galleries.scss';

export default angular.module('aksiteApp.galleries', [uirouter, gallery])
    .config(routing)
    .controller('GalleriesController', GalleriesController)
    .name;
