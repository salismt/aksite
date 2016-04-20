import angular from 'angular';
import ngFileUpload from 'ng-file-upload';

import PostEditorController from './postEditor.controller';

//import '!raw!sass!./postEditor.scss';

export default angular.module('aksiteApp.admin.postEditor', [ngFileUpload])
    .controller('PostEditorController', PostEditorController)
    .name;
