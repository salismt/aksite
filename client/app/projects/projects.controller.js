'use strict';

export default function ProjectsController($scope, Project) {
    'ngInject';
    $scope.loadingProjects = true;
    $scope.projects = Project.query(function() {
        $scope.loadingProjects = false;
    });
}
