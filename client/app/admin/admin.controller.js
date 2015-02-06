'use strict';

angular.module('aksiteApp')
    .controller('AdminCtrl', function($scope, $mdSidenav) {
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

        $scope.toggleLeft = function() {
            $mdSidenav('left').toggle()
                .then(function(){
                    $log.debug("toggle left is done");
                });
        };
    })
    .controller('LeftCtrl', function($scope, $timeout, $mdSidenav, $log) {
        $scope.close = function() {
            $mdSidenav('left').close()
                .then(function(){
                    $log.debug("close LEFT is done");
                });
        };
    });
