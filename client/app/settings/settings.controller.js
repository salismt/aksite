'use strict';

angular.module('aksiteApp')
    .controller('SettingsCtrl', function($scope, $mdSidenav, Auth) {
        $scope.currentUser = Auth.getCurrentUser();
        
        $scope.sections = [
            {
                title: 'Dashboard',
                icon: 'fa-home',
                link: 'settings.dashboard'
            }, {
                title: 'Profile',
                icon: 'fa-user',
                link: 'settings.profile'
            }
        ];

        $scope.toggleLeft = function () {
            $mdSidenav('left').toggle()
                .then(function() {
                    //$log.debug("toggle left is done");
                });
        };
    })
    .controller('SettingsSidebarCtrl', function($scope, $timeout, $mdSidenav, $log) {
        $scope.close = function() {
            $mdSidenav('left').close()
                .then(function(){
                    //$log.debug("close LEFT is done");
                });
        };
    });
