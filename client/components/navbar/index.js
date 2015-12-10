/**
 * Created by Awk34 on 11/1/2015.
 */

import angular from 'angular';

import Auth from '../auth/auth.service'

import NavbarController from './navbar.controller';

export default angular.module('directives.navbar', [Auth])
    .directive('navbar', () => ({
        template: require('./navbar.html'),
        restrict: 'E',
        controller: NavbarController,
        controllerAs: 'nav'
    }))
    .name;
