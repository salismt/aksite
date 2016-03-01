'use strict';

export default class AdminController {
    sections = [{
        title: 'Home',
        icon: 'fa-home',
        sref: 'admin.dashboard'
    }, {
        title: 'Users',
        icon: 'fa-user',
        sref: 'admin.users'
    }, {
        title: 'Galleries',
        icon: 'fa-photo',
        sref: 'admin.galleries'
    }, {
        title: 'Projects',
        icon: 'fa-briefcase',
        sref: 'admin.projects'
    }, {
        title: 'Blog',
        icon: 'fa-newspaper-o',
        sref: 'admin.blog'
    }, {
        title: 'Files',
        icon: 'fa-files-o',
        sref: 'admin.files'
    }, {
        title: 'Settings',
        icon: 'fa-cog',
        sref: 'admin.settings'
    }];

    /*@ngInject*/
    constructor($mdSidenav) {
        this.$mdSidenav = $mdSidenav;
    }

    toggleLeft() {
        this.$mdSidenav('left').toggle()
            .then(function() {
                //$log.debug("toggle left is done");
            });
    }
}
