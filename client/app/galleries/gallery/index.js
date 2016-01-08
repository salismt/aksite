import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './gallery.routes';
import GalleryController from './gallery.controller';

//import '!raw!sass!./project.scss';

export default angular.module('aksiteApp.galleries.gallery', [uirouter])
    .config(routing)
    .controller('GalleryController', GalleryController)
    .name;
