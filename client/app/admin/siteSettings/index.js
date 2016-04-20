import angular from 'angular';

import SiteSettingsController from './siteSettings.controller';

//import '!raw!sass!./siteSettings.scss';

export default angular.module('aksiteApp.admin.siteSettings', [])
    .controller('SiteSettingsController', SiteSettingsController)
    .name;
