'use strict';
import angular from 'angular';

import FooterController from './footer.controller';

export default angular.module('directives.footer', [])
    .directive('footer', () => ({
        template: require('./footer.html'),
        restrict: 'E',
        controller: FooterController
    }))
    .name;
