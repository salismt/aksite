'use strict';

angular.module('aksiteApp')
    .controller('ProjectsCtrl', function($scope, Project) {
        $scope.projects = Project.query();
    });
