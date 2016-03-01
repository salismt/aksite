'use strict';

export default class SettingsController {
    sections = [{
        title: 'Dashboard',
        icon: 'fa-home',
        link: 'settings.dashboard'
    }, {
        title: 'Profile',
        icon: 'fa-user',
        link: 'settings.profile'
    }];

    /*@ngInject*/
    constructor($mdSidenav, Auth) {
        this.$mdSidenav = $mdSidenav;

        this.currentUser = Auth.getCurrentUser();
        this.heightStyle = {
            height: window.innerHeight - 70 - 66
        };
    }

    toggleLeft() {
        this.$mdSidenav('left').toggle()
            .then(function() {
                //$log.debug("toggle left is done");
            });
    }
}
