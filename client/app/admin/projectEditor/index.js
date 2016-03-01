import angular from 'angular';
import ngFileUpload from 'ng-file-upload';

import routing from './projectEditor.routes';
import ProjectEditorController from './projectEditor.controller';

//import '!raw!sass!./projectEditor.scss';

export default angular.module('aksiteApp.admin.projectEditor', [ngFileUpload])
    .config(routing)
    .controller('ProjectEditorController', ProjectEditorController)
    .name;
