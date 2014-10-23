'use strict';

angular.module('aksiteApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [
      {
        'title': 'Home',
        'link': '/'
      },
      {
        'title': 'Résumé',
        //'link': '/resume'
        'link': 'https://www.linkedin.com/profile/view?id=168041753'
      },
      {
        'title': 'Projects',
        'link': '/projects'
      },
      {
        'title': 'Photography',
        'link': '/photos'
      },
      {
        'title': 'Blog',
        'link': '/blog'
      }
    ];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function () {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function (route) {
      return route === $location.path();
    };
  });
