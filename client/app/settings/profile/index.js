import angular from 'angular';

import routing from './profile.routes';
import ProfileSettingsController from './profile.controller';

//import '!raw!sass!./profile.scss';

export default angular.module('aksiteApp.settings.profile', [])
    .config(routing)
    .controller('ProfileSettingsController', ProfileSettingsController)
    .name;
