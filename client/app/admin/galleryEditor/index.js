import angular from 'angular';
import ngFileUpload from 'ng-file-upload'

import routing from './galleryEditor.routes';
import GalleryEditorController from './galleryEditor.controller';

//import '!raw!sass!./galleryEditor.scss';

export default angular.module('aksiteApp.admin.galleryEditor', [ngFileUpload])
    .config(routing)
    .controller('GalleryEditorController', GalleryEditorController)
    .name;
