import angular from 'angular';

import DashboardController from './dashboard.controller';

//import '!raw!sass!./dashboard.scss';

export default angular.module('aksiteApp.admin.dashboard', [])
    .controller('DashboardController', DashboardController)
    .name;
