import angular from 'angular';
import ngFileUpload from 'ng-file-upload';

import routing from './userEditor.routes';
import UserEditorController from './userEditor.controller';

//import '!raw!sass!./userEditor.scss';

export default angular.module('aksiteApp.admin.userEditor', [ngFileUpload])
    .config(routing)
    .controller('UserEditorController', UserEditorController)
    .name;
