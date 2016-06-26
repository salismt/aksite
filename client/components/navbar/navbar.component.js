'use strict';
import angular from 'angular';
import {Component} from '@angular/core';
import {upgradeAdapter} from '../../app/upgrade_adapter';
import {CollapseDirective} from 'ng2-bootstrap';

//import './navbar.scss';

@Component({
    selector: 'navbar',
    template: require('./navbar.html'),
    directives: [CollapseDirective]
})
export class NavbarComponent {
    isCollapsed = true;
    menu = [{
        title: 'Home',
        link: '/'
    }, {
        title: 'Résumé',
        //link: '/resume'
        link: 'https://www.linkedin.com/in/koroluka'
    }, {
        title: 'Projects',
        link: '/projects'
    }, {
        title: 'Photography',
        link: '/galleries'
    }, {
        title: 'Blog',
        link: '/blog'
    }];

    static parameters = ['$location', '$state', 'Auth'];
    constructor($location, $state, Auth) {
        this.$location = $location;
        this.$state = $state;
        this.isLoggedIn = (...args) => Auth.isLoggedIn(...args);
        this.isAdmin = (...args) => Auth.isAdmin(...args);
        this.getCurrentUser = (...args) => Auth.getCurrentUser(...args);
        this.authLogout = () => Auth.logout();
    }

    logout() {
        this.authLogout();
        this.$location.path('/login');
    }

    isActive(route) {
        return route === this.$location.path();
    }

    sref(id) {
        this.$state.go(id);
    }
}

export default angular.module('directives.navbar', [])
    .directive('navbar', upgradeAdapter.downgradeNg2Component(NavbarComponent))
    .name;
