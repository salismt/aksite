import angular from 'angular';

import BlogManagerController from './blogManager.controller';

//import '!raw!sass!./blogManager.scss';

export default angular.module('aksiteApp.admin.blogManager', [])
    .controller('BlogManagerController', BlogManagerController)
    .name;
