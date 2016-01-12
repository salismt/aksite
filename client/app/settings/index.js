import angular from 'angular';
import uirouter from 'angular-ui-router';

import dashboard from './dashboard';
import profile from './profile';

import routing from './settings.routes';
import SettingsSidenavController from './sidenav.controller';
import SettingsController from './settings.controller';

//import '!raw!sass!./settings.scss'

export default angular.module('aksiteApp.settings', [
    uirouter,
    dashboard,
    profile
])
    .config(routing)
    .controller('SettingsSidenavController', SettingsSidenavController)
    .controller('SettingsController', SettingsController)
    .name;
