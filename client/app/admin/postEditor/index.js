import angular from 'angular';
import ngFileUpload from 'ng-file-upload'

import routing from './postEditor.routes';
import PostEditorController from './postEditor.controller';

//import '!raw!sass!./postEditor.scss';

export default angular.module('aksiteApp.admin.postEditor', [ngFileUpload])
    .config(routing)
    .controller('PostEditorController', PostEditorController)
    .name;
