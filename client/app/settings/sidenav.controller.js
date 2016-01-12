'use strict';

export default function SettingsSidenavController($scope, $timeout, $mdSidenav) {
    'ngInject';
    $scope.close = function() {
        $mdSidenav('left').close()
            .then(function(){
                //$log.debug("close LEFT is done");
            });
    };
}
