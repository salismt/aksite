'use strict';

export default function SettingsController($scope, $mdSidenav, Auth) {
    'ngInject';
    $scope.currentUser = Auth.getCurrentUser();
    $scope.heightStyle = {
        height: (window.innerHeight - 70 - 66)
    };

    $scope.sections = [{
        title: 'Dashboard',
        icon: 'fa-home',
        link: 'settings.dashboard'
    }, {
        title: 'Profile',
        icon: 'fa-user',
        link: 'settings.profile'
    }];

    $scope.toggleLeft = function () {
        $mdSidenav('left').toggle()
            .then(function() {
                //$log.debug("toggle left is done");
            });
    };
}
