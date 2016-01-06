import angular from 'angular';

import routing from './galleryManager.routes';
import GalleryManagerController from './galleryManager.controller';

//import '!raw!sass!./galleryManager.scss';

export default angular.module('aksiteApp.admin.galleryManager', [])
    .config(routing)
    .controller('GalleryManagerController', GalleryManagerController)
    .name;
