'use strict';
import angular from 'angular';
import {upgradeAdapter} from './upgrade_adapter';
import 'reflect-metadata';
// import {bootstrap} from 'ng-forward';
import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';
// import ngSocketio from 'angular-socket-io';
import 'angular-socket-io';
import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';
import ngFileUpload from 'ng-file-upload';
import ngMaterial from 'angular-material';
import ngMessages from 'angular-messages';

import _Auth from '../components/auth/auth.service';
import User from '../components/auth/user.service';
import Project from '../components/Project/Project.service';
import Gallery from '../components/gallery/gallery.service';
import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import Preloader from '../components/preloader/preloader.directive';

import routing from './app.config';

import main from './main';
import account from './account';
import resume from './resume';
import blog from './blog';
import projects from './projects';
import galleries from './galleries';
import admin from './admin';
import user from './user';
import settings from './settings';

import '../../node_modules/angular-material/angular-material.scss';
import './app.scss';

angular.module('aksiteApp', [
    ngAnimate,
    ngCookies,
    ngResource,
    ngSanitize,
    'btford.socket-io',
    uiRouter,
    uiBootstrap,
    ngFileUpload,
    ngMaterial,
    ngMessages,
    main,
    _Auth,
    User,
    Project,
    Gallery,
    navbar,
    footer,
    account,
    resume,
    blog,
    projects,
    galleries,
    admin,
    user,
    settings
])
    .config(routing)
    .factory('authInterceptor', function($rootScope, $q, $cookies, $injector) {
        'ngInject';
        var state;
        return {
            // Add authorization token to headers
            request(config) {
                config.headers = config.headers || {};
                if($cookies.get('token')) {
                    config.headers.Authorization = `Bearer ${$cookies.get('token')}`;
                }
                return config;
            },

            // Intercept 401s and redirect you to login
            responseError(response) {
                if(response.status === 401) {
                    (state || (state = $injector.get('$state'))).go('login');
                    // remove any stale tokens
                    $cookies.remove('token');
                    return $q.reject(response);
                } else {
                    return $q.reject(response);
                }
            }
        };
    })
    .run(function($rootScope, $location, Auth) {
        'ngInject';
        // Redirect to login if route requires auth and you're not logged in
        $rootScope.$on('$stateChangeStart', function(event, next) {
            $rootScope.title = 'Andrew Koroluk';
            Auth.isLoggedInAsync(function(loggedIn) {
                if(next.authenticate && !loggedIn) {
                    $location.path('/login');
                }
            });
        });

        $rootScope.titleRoot = 'AK';
        $rootScope.title = 'Andrew Koroluk';
    })
    .directive('preloader', Preloader);

angular
    .element(document)
    .ready(() => {
        upgradeAdapter.bootstrap(document, ['aksiteApp'], {
            strictDi: true
        });
    });

upgradeAdapter.upgradeNg1Provider('$location');
upgradeAdapter.upgradeNg1Provider('$state');
upgradeAdapter.upgradeNg1Provider('Auth');
