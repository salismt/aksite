'use strict';

angular.module('aksiteApp')
    .controller('ProjectmanagerCtrl', function($scope, $http, $upload) {
        $scope.project = {
            hidden: false
        };
        //$scope.projects = Project.query();
        $scope.errors = {};
        $scope.progress = undefined;

        $scope.addProject = function(form) {
            console.log(form);

            $scope.submitted = true;

            if(form.$valid) {
                console.log('validdd');
                console.log($scope.project);
                console.log(form);

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
