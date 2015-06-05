'use strict';

angular.module('aksiteApp')
    .controller('UsermanagerCtrl', function($scope, $http, Auth, User, $state, $mdDialog, $mdToast, $animate) {
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
                    User.remove({id: user._id}, function() {
                            $scope.users.splice(this.$index, 1);
                        }.bind(this), function() {
                            $mdToast.show(
                                $mdToast.simple()
                                    .content('Deleting user failed')
                                    .position('bottom right')
                                    .hideDelay(10000)
                            );
                        });
                });
        };
    });
