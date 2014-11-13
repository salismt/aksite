'use strict';

angular.module('aksiteApp')
    .controller('AdminCtrl', function($scope) {
        $scope.pages = [
            {
                name: 'Users',
                icon: 'fa-user',
                link: 'admin/users'
            }, {
                name: 'Photos',
                icon: 'fa-photo',
                link: 'admin/photos'
            }, {
                name: 'Projects',
                icon: 'fa-briefcase',
                link: 'admin/projects'
            }, {
                name: 'Blog',
                icon: 'fa-newspaper-o',
                link: 'admin/blog'
            }, {
                name: 'Featured',
                icon: 'fa-star-o',
                link: 'admin/featured'
            }, {
                name: 'Files',
                icon: 'fa-files-o',
                link: 'admin/files'
            }, {
                name: 'Settings',
                icon: 'fa-cog',
                link: 'admin/settings'
            }
        ];
    });
