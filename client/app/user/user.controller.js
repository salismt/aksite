'use strict';

angular.module('aksiteApp')
    .controller('UserCtrl', function($scope, $stateParams, User) {
        $scope.id = $stateParams.id;

        $scope.user = User.get({id: $scope.id});
    });
