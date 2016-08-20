'use strict';
import angular from 'angular';
import oclazyload from 'oclazyload';
import {upgradeAdapter} from './upgrade_adapter';
import Raven from 'raven-js';
import RavenAngular from 'raven-js/plugins/angular.js';
import 'reflect-metadata';

import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';
import 'angular-socket-io';
import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';
import ngFileUpload from 'ng-file-upload';
import ngMaterial from 'angular-material';
import ngMessages from 'angular-messages';

import _Auth from '../components/auth/auth.service';
import User from '../components/auth/user.service';
import Gallery from '../components/gallery/gallery.service';
import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import Preloader from '../components/preloader/preloader.component';

import routing from './app.config';
import Constants from './app.constants';
upgradeAdapter.addProvider(Constants);

import main from './main';
import account from './account';
import resume from './resume';
import blog from './blog/blog.component';
import projects from './projects';
import galleries from './galleries';
import adminRoutes from './admin/admin.routes';
import user from './user';
import settings from './settings';

import '../../node_modules/angular-material/angular-material.scss';
import './app.scss';

// class RavenExceptionHandler {
//     call(err) {
//         Raven.captureException(err.originalException);
//     }
// }

angular.module('aksiteApp', [
    ngAnimate,
    ngCookies,
    ngResource,
    ngSanitize,
    'btford.socket-io',
    uiRouter,
    oclazyload,
    uiBootstrap,
    ngFileUpload,
    ngMaterial,
    ngMessages,
    main,
    _Auth,
    User,
    Gallery,
    navbar,
    footer,
    Preloader,
    account,
    resume,
    blog,
    projects,
    galleries,
    adminRoutes,
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
    .factory('constants', upgradeAdapter.downgradeNg2Provider(Constants))
    .run(function($rootScope, $location, Auth, constants) {
        'ngInject';

        Raven
            .config(constants.default.sentry.publicDsn)
            .addPlugin(RavenAngular, angular)
            .install();

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
    });

angular
    .element(document.body)
    .ready(() => {
        upgradeAdapter.bootstrap(document.body, [
            'aksiteApp',
            // {provide: ExceptionHandler, useClass: RavenExceptionHandler}
        ], {strictDi: true});
    });

upgradeAdapter.upgradeNg1Provider('$rootScope');
upgradeAdapter.upgradeNg1Provider('$http');
upgradeAdapter.upgradeNg1Provider('$location');
upgradeAdapter.upgradeNg1Provider('$state');
upgradeAdapter.upgradeNg1Provider('$stateParams');
upgradeAdapter.upgradeNg1Provider('$sce');
upgradeAdapter.upgradeNg1Provider('Auth');
