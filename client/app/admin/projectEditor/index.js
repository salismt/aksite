import angular from 'angular';
import ngFileUpload from 'ng-file-upload';

import ProjectEditorController from './projectEditor.controller';

//import '!raw!sass!./projectEditor.scss';

export default angular.module('aksiteApp.admin.projectEditor', [ngFileUpload])
    .controller('ProjectEditorController', ProjectEditorController)
    .name;
