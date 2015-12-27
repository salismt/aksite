'use strict';

export default function LeftController($scope, $timeout, $mdSidenav) {
    $scope.close = function() {
        $mdSidenav('left').close()
            .then(function() {
                //$log.debug("close LEFT is done");
            });
    };
}
