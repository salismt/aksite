import angular from 'angular';
import ngFileUpload from 'ng-file-upload';

import UserEditorController from './userEditor.controller';

//import '!raw!sass!./userEditor.scss';

export default angular.module('aksiteApp.admin.userEditor', [ngFileUpload])
    .controller('UserEditorController', UserEditorController)
    .name;
