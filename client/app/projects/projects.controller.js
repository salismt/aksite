'use strict';

angular.module('aksiteApp')
    .controller('ProjectsCtrl', function($scope, Project) {
        $scope.loadingProjects = true;
        $scope.projects = Project.query(function() {
            $scope.loadingProjects = false;
        });
    });
