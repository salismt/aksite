'use strict';

angular.module('aksiteApp')
    .controller('ProjectmanagerCtrl', function($scope, $http, $upload, $sanitize) {
        $scope.project = {
            name: undefined,
            info: undefined,
            file: null,
            content: undefined,
            hidden: false
        };
        //$scope.projects = Project.query();
        $scope.errors = {};
        $scope.progress = undefined;
        $scope.markedContent = function() {
            try {
                return $sanitize(marked($scope.project.content || ''));
            } catch(e) {
                return '<h1 class=\"text-danger\">Parsing Error</h1>';
            }
        };

        $scope.addProject = function(form) {
            console.log(form);

            $scope.submitted = true;

            if(form.$valid) {

                $scope.submitted = true;

                if(form.$valid) {
                    $scope.upload = $upload.upload({
                        url: 'api/projects',
                        method: 'POST',
                        file: $scope.fileToUpload,
                        data: {
                            name: $scope.project.name,
                            info: $scope.project.info,
                            content: $scope.project.content,
                            hidden: $scope.project.hidden
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
                            //$scope.projects = Project.query();
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

        $scope.onFileSelect = function($files) {
            //$files: an array of files selected, each file has name, size, and type.
            var file = $files[0];

            $scope.filename = file.name;
            $scope.fileToUpload = file;
        };
    });
