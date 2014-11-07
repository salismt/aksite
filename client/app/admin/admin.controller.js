'use strict';

angular.module('aksiteApp')
    .controller('AdminCtrl', function($scope, $http, Auth, User) {
        $scope.pages = [
            {
                name: "Users",
                icon: "fa-user",
                link: "admin/users"
            }, {
                name: "Photos",
                icon: "fa-photo",
                link: "admin/photos"
            }, {
                name: "Projects",
                icon: "fa-briefcase",
                link: "admin/projects"
            }, {
                name: "Blog",
                icon: "fa-newspaper-o",
                link: "admin/blog"
            }, {
                name: "Files",
                icon: "fa-files-o",
                link: "admin/files"
            }, {
                name: "Settings",
                icon: "fa-cog",
                link: "admin/settings"
            }
        ];

        // Use the User $resource to fetch all users
        $scope.users = User.query();

        $scope.deleteUser = function(user) {
            User.remove({id: user._id});
            angular.forEach($scope.users, function(u, i) {
                if(u === user) {
                    $scope.users.splice(i, 1);
                }
            });
        };
    });
