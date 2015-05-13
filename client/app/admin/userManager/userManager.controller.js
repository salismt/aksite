'use strict';

angular.module('aksiteApp')
    .controller('UsermanagerCtrl', function($scope, $http, Auth, User, $state) {
        $scope.users = User.query();

        $scope.goToUser = function(id, event) {
            $state.go('userEditor', {userId: id});
        };

        $scope.deleteUser = function(user) {
            User.remove({id: user._id});
            angular.forEach($scope.users, function(u, i) {
                if(u === user) {
                    $scope.users.splice(i, 1);
                }
            });
        };
    });
