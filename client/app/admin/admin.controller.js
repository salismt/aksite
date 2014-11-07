'use strict';

angular.module('aksiteApp')
    .controller('AdminCtrl', function ($scope, $http, Auth, User) {
        $scope.pages = [
            {
                name: "Users",
                icon: "fa-user",
                link: "users"
            }, {
                name: "Photos",
                icon: "fa-photo",
                link: "users"
            }, {
                name: "Projects",
                icon: "fa-briefcase",
                link: "users"
            }, {
                name: "Blog",
                icon: "fa-file-text-o",
                link: "users"
            }, {
                name: "Files",
                icon: "fa-files-o",
                link: "users"
            }, {
                name: "Settings",
                icon: "fa-cog",
                link: "users"
            }
        ];

        // Use the User $resource to fetch all users
        $scope.users = User.query();

        $scope.deleteUser = function (user) {
            User.remove({ id: user._id });
            angular.forEach($scope.users, function (u, i) {
                if (u === user) {
                    $scope.users.splice(i, 1);
                }
            });
        };
    });
