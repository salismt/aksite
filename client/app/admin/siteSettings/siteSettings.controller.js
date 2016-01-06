'use strict';

export default function($scope, $http) {
    'ngInject';
    $scope.cleanOrphans = function() {
        $http.get('/api/upload/clean')
            .success(function(data, status/*, headers, config*/) {
                console.log(status);
                console.log(data);
            })
            .error(function(data, status/*, headers, config*/) {
                console.log(status);
                console.log(data);
            });
    };
}
