'use strict';

export default function($scope, $http) {
    $scope.errors = [];
    $scope.loadingProjects = true;
    $scope.projects = [];
    $scope.projectDeletions = [];
    $scope.projectChanges = [];
    $scope.dirty = false;

    $http.get('/api/projects')
        .success(function(res) {
            $scope.projects = res;
        })
        .error(function(res, status) {
            console.log(res);
            console.log(status);
        })
        .finally(function() {
            $scope.loadingProjects = false;
        });

    $scope.toggleProjectDeletion = function(project) {
        if(!project.deleted) {
            project.deleted = true;
            $scope.dirty = true;
            $scope.projectDeletions.push(project);
        } else {
            project.deleted = false;
            _.remove($scope.projectDeletions, function(thisProject) {
                return thisProject._id === project._id;
            });
            if($scope.projectDeletions.length === 0) {
                $scope.dirty = false;
            }
        }
    };

    $scope.saveChanges = function() {
        // Delete projects
        _.forEach($scope.projectDeletions, function(project) {
            $http.delete('/api/projects/'+project._id)
                .success(function(res, status) {
                    _.remove($scope.projects, project);
                    $scope.dirty = false;
                    console.log(res);
                    console.log(status);
                })
                .error(function(res, status) {
                    console.log(res);
                    console.log(status);
                });
        });
    };
}
