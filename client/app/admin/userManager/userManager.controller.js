'use strict';

angular.module('aksiteApp')
    .controller('UsermanagerCtrl', function($scope, $http, Auth, User, $state, $mdDialog) {
        $scope.users = User.query();

        $scope.goToUser = function(id) {
            $state.go('userEditor', {userId: id});
        };

        $scope.deleteUser = function(user, ev) {
            $mdDialog.show($mdDialog.confirm()
                .title('Are you sure you would like to delete this user?')
                .ariaLabel('Delete User?')
                .ok('Delete')
                .cancel('Cancel')
                .targetEvent(ev))
                .then(() => {
                    User.remove({id: user._id});
                    $scope.users.splice(this.$index, 1);
                });
        };
    });
