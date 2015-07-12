'use strict';

angular.module('aksiteApp')
    .controller('AdminCtrl', function($scope, $mdSidenav, $timeout, $log) {
        $scope.sections = [
            {
                title: 'Home',
                icon: 'fa-home',
                link: 'admin.dashboard'
            }, {
                title: 'Users',
                icon: 'fa-user',
                link: 'admin.users'
            }, {
                title: 'Photos',
                icon: 'fa-photo',
                link: 'admin.photos'
            }, {
                title: 'Projects',
                icon: 'fa-briefcase',
                link: 'admin.projects'
            }, {
                title: 'Blog',
                icon: 'fa-newspaper-o',
                link: 'admin.blog'
            }, {
                title: 'Featured',
                icon: 'fa-star-o',
                link: 'admin.featured'
            }, {
                title: 'Files',
                icon: 'fa-files-o',
                link: 'admin.files'
            }, {
                title: 'Settings',
                icon: 'fa-cog',
                link: 'admin.settings'
            }
        ];

        $scope.toggleLeft = function() {
            $mdSidenav('left').toggle()
                .then(function() {
                    //$log.debug("toggle left is done");
                });
        };
    })
    .controller('LeftCtrl', function($scope, $timeout, $mdSidenav, $log) {
        $scope.close = function() {
            $mdSidenav('left').close()
                .then(function() {
                    //$log.debug("close LEFT is done");
                });
        };
    });
