'use strict';
import { Component, Inject, bundle } from 'ng-forward';

//import './navbar.scss';

@Component({
    selector: 'navbar',
    template: require('./navbar.html'),
    controllerAs: 'nav'
})
@Inject('$location', 'Auth')
class Navbar {
    menu = [{
        title: 'Home',
        link: '/'
    }, {
        title: 'Résumé',
        //link: '/resume'
        link: 'https://www.linkedin.com/profile/view?id=168041753'
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

    /*@ngInject*/
    constructor($location, Auth) {
        this.isCollapsed = true;
        this.isLoggedIn = (...args) => Auth.isLoggedIn(...args);
        this.isAdmin = (...args) => Auth.isAdmin(...args);
        this.getCurrentUser = (...args) => Auth.getCurrentUser(...args);
        this.authLogout = () => Auth.logout();
        this.$location = $location;
    }

    logout() {
        this.authLogout();
        this.$location.path('/login');
    }

    isActive(route) {
        return route === this.$location.path();
    }
}

export default bundle('directives.navbar', Navbar).name;
