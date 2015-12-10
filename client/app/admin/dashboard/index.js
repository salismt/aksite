import angular from 'angular';

import routing from './dashboard.routes';
import DashboardController from './dashboard.controller';

//import '!raw!sass!./dashboard.scss';

export default angular.module('aksiteApp.admin.dashboard', [])
    .config(routing)
    .controller('DashboardController', DashboardController)
    .name;
