import angular from 'angular';

import routing from './blogManager.routes';
import BlogManagerController from './blogManager.controller';

//import '!raw!sass!./blogManager.scss';

export default angular.module('aksiteApp.admin.blogManager', [])
    .config(routing)
    .controller('BlogManagerController', BlogManagerController)
    .name;
