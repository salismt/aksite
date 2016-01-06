'use strict';

function AdminController($scope, $mdSidenav) {
    $scope.sections = [{
        title: 'Home',
        icon: 'fa-home',
        link: 'admin.dashboard'
    }, {
        title: 'Users',
        icon: 'fa-user',
        link: 'admin.users'
    }, {
        title: 'Galleries',
        icon: 'fa-photo',
        link: 'admin.galleries'
    }, {
        title: 'Projects',
        icon: 'fa-briefcase',
        link: 'admin.projects'
    }, {
        title: 'Blog',
        icon: 'fa-newspaper-o',
        link: 'admin.blog'
    }, {
        title: 'Files',
        icon: 'fa-files-o',
        link: 'admin.files'
    }, {
        title: 'Settings',
        icon: 'fa-cog',
        link: 'admin.settings'
    }];

    $scope.toggleLeft = function() {
        $mdSidenav('left').toggle()
            .then(function() {
                //$log.debug("toggle left is done");
            });
    };
}

export default AdminController;
