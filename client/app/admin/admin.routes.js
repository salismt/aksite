'use strict';
import angular from 'angular';
import Promise from 'bluebird';

import blogManagerRoutes from './blogManager/blogManager.routes';
import dashboardRoutes from './dashboard/dashboard.routes';
import fileManagerRoutes from './fileManager/fileManager.routes';
import galleryEditorRoutes from './galleryEditor/galleryEditor.routes';
import galleryManagerRoutes from './galleryManager/galleryManager.routes';
import postEditorRoutes from './postEditor/postEditor.routes';
import projectEditorRoutes from './projectEditor/projectEditor.routes';
import projectManagerRoutes from './projectManager/projectManager.routes';
import siteSettingsRoutes from './siteSettings/siteSettings.routes';
import userEditorRoutes from './userEditor/userEditor.routes';
import userManagerRoutes from './userManager/userManager.routes';

export function adminRoutes($stateProvider) {
    'ngInject';
    $stateProvider
        .state('admin', {
            abstract: true,
            url: '/admin',
            template: require('./admin.html'),
            controller: 'AdminController',
            controllerAs: 'admin',
            onEnter: $rootScope => {
                $rootScope.title = `${$rootScope.titleRoot}' | Admin`;
            },
            resolve: {
                loadAdminModule($ocLazyLoad) {
                    return new Promise(resolve => {
                        require.ensure([], () => {
                            let module = require('./admin.module').default;
                            console.log(module);
                            $ocLazyLoad.load({name: module.name});
                            resolve(module.controller);
                        });
                    });
                }
            }
        });
}

export default angular.module('aksiteApp.admin.routing', [])
    .config(blogManagerRoutes)
    .config(dashboardRoutes)
    .config(fileManagerRoutes)
    .config(galleryEditorRoutes)
    .config(galleryManagerRoutes)
    .config(postEditorRoutes)
    .config(projectEditorRoutes)
    .config(projectManagerRoutes)
    .config(siteSettingsRoutes)
    .config(userEditorRoutes)
    .config(userManagerRoutes)
    .config(adminRoutes);
