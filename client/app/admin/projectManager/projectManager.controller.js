'use strict';

angular.module('aksiteApp')
    .controller('ProjectmanagerCtrl', function($scope, $http, $upload) {
        $scope.project = {
            hidden: false
        };
        $scope.errors = {};

        $scope.addProject = function(form) {
            console.log(form);

            $scope.submitted = true;

            if(form.$valid) {
                console.log('validdd');
                console.log($scope.project);
                $http.post('', $scope.project)
                    .success(function() {

                    })
                    .error(function() {

                    });
            //    $scope.upload = $upload.upload({
            //        url: 'api/upload',
            //        method: 'POST',
            //        file: $scope.fileToUpload,
            //        data: {
            //            name: $scope.photo.name,
            //            info: $scope.photo.info,
            //            purpose: 'photo'
            //        }
            //    })
            //        .progress(function(evt) {
            //            $scope.progress = (100.0 * (evt.position / evt.total)).toFixed(1);
            //            console.log(evt);
            //        })
            //        .success(function(data) {
            //            $scope.progress = undefined;
            //            //console.log(data);
            //            $scope.photos = Photo.query();
            //        })
            //        .error(function(response, status, headers, config) {
            //            $scope.progress = undefined;
            //        })
            //        .xhr(function(xhr) {
            //            // to abort, use ng-click like: ng-click="abort()"
            //            $scope.abort = function() {
            //                xhr.abort();
            //            };
            //        });
            }
        };

        $scope.onFileSelect = function($files) {
            //$files: an array of files selected, each file has name, size, and type.
            var file = $files[0];

            $scope.filename = file.name;
            $scope.fileToUpload = file;
        };
    });
