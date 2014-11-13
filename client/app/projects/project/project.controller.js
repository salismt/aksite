'use strict';

angular.module('aksiteApp')
    .controller('ProjectCtrl', function ($scope, $http, $stateParams) {
        $scope.projectId = $stateParams.projectId;

        $http.get('/api/projects/'+$stateParams.projectId)
            .success(function(project) {
                $scope.project = project;
                $scope.content = marked(project.content);
            })
            .error(function(data, status) {
                $scope.error = status;
            });
    });
