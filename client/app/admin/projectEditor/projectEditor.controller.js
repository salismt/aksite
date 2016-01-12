'use strict';

import marked from 'marked';

export default function ProjectEditorController($scope, $http, $stateParams, $state, $sanitize, Upload) {
    'ngInject';
    $scope.loadingProject = true;
    if(!$stateParams.projectId || $stateParams.projectId === 'new') {
        $scope.project = {
            name: 'Untitled Project',
            info: undefined,
            file: null,
            content: undefined,
            hidden: false
        };
        $scope.loadingProject = false;
        $scope.newProject = true;
    } else {
        $http.get('/api/projects/'+$stateParams.projectId)
            .success(function(res) {
                $scope.project = res;
                $scope.filename = $scope.project.coverId;
                if($scope.project.hidden !== true && $scope.project.hidden !== false) {
                    $scope.project.hidden = false;
                }
            })
            .error(function(res, status) {
                $scope.error = {status: status, res: res};
            })
            .finally(function() {
                $scope.loadingProject = true;
            });
    }

    $scope.cancel = function() {
        if($scope.upload) $scope.upload.abort();
        $state.go('admin.projects');
    };

    $scope.markedContent = function() {
        try {
            return $sanitize(marked($scope.project.content || ''));
        } catch(e) {
            return '<h1 class=\"text-danger\">Parsing Error</h1>';
        }
    };

    $scope.onFileSelect = function($files) {
        //$files: an array of files selected, each file has name, size, and type.
        var file = $files[0];

        if(!file) {
            $scope.filename = null;
            $scope.fileToUpload = null;
        } else {
            $scope.filename = file.name;
            $scope.fileToUpload = file;
        }
    };

    $scope.saveProject = function(form) {
        $scope.submitted = true;
        console.log(form);

        if(form.$valid) {
            if(!$scope.newProject && ($scope.filename === $scope.project.coverId || $scope.filename === null)) {
                $scope.upload = Upload.upload({
                        url: 'api/projects/'+$scope.project._id,
                        method: 'PUT',
                        fields: $scope.project
                    })
                    .progress(function(evt) {
                        $scope.progress = (100.0 * (evt.position / evt.total)).toFixed(1);
                    })
                    .success(function(data, status) {
                        $scope.progress = undefined;
                        console.log(status);
                        console.log(data);
                        $state.go('admin.projects');
                    })
                    .error(function(response, status) {
                        $scope.progress = undefined;
                        console.log(status);
                        console.log(response);
                    })
                    .xhr(function(xhr) {
                        $scope.abort = function() {
                            xhr.abort();
                        };
                    });
            } else if(!$scope.newProject) {
                var updated = $scope.project;
                updated.newImage = true;
                $scope.upload = Upload.upload({
                        url: 'api/projects/'+$scope.project._id,
                        method: 'PUT',
                        file: $scope.fileToUpload,
                        fields: {
                            name: $scope.project.name,
                            info: $scope.project.info,
                            content: $scope.project.content,
                            hidden: $scope.project.hidden,
                            newImage: true
                        },
                        headers: {
                            'Content-Type': $scope.fileToUpload.type
                        }
                    })
                    .progress(function(evt) {
                        $scope.progress = (100.0 * (evt.position / evt.total)).toFixed(1);
                    })
                    .success(function(data, status) {
                        $scope.progress = undefined;
                        console.log(status);
                        console.log(data);
                        $state.go('admin.projects');
                    })
                    .error(function(response, status) {
                        $scope.progress = undefined;
                        console.log(status);
                        console.log(response);
                    })
                    .xhr(function(xhr) {
                        $scope.abort = function() {
                            xhr.abort();
                        };
                    });
            } else {
                $scope.upload = Upload.upload({
                        url: 'api/projects',
                        method: 'POST',
                        file: $scope.fileToUpload,
                        fields: {
                            name: $scope.project.name,
                            info: $scope.project.info,
                            content: $scope.project.content,
                            hidden: $scope.project.hidden
                        },
                        headers: {
                            'Content-Type': $scope.fileToUpload.type
                        }
                    })
                    .progress(function(evt) {
                        $scope.progress = (100.0 * (evt.position / evt.total)).toFixed(1);
                        console.log(evt);
                    })
                    .success(function(data, status) {
                        $scope.progress = undefined;
                        console.log(status);
                        console.log(data);
                        $state.go('admin.projects');
                    })
                    .error(function(response, status) {
                        $scope.progress = undefined;
                        console.log(status);
                        console.log(response);
                    })
                    .xhr(function(xhr) {
                        $scope.abort = function() {
                            xhr.abort();
                        };
                    });
            }
        }
    };
};
