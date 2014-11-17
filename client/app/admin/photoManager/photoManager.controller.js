'use strict';

angular.module('aksiteApp')
    .controller('PhotomanagerCtrl', function($scope, $http, $upload, Photo) {
        $scope.photo = {
            hidden: false
        };
        $scope.errors = {};
        $scope.progress = {

        };
        $scope.photos = [];

        $scope.featurePhoto = function(photo) {
            $http.post('/api/featured/' + photo._id, {
                type: 'photo',
                name: photo.name,
                link: ''
            })
                .success(function(data, status) {
                    console.log(status);
                })
                .error(function(data, status) {
                    console.log(data);
                    console.log(status);
                });
        };

        $scope.deletePhoto = function(photo) {
            Photo.remove({id: photo._id});
            angular.forEach($scope.photos, function(u, i) {
                if(u === photo) {
                    $scope.photos.splice(i, 1);
                }
            });
        };

        $scope.deleteFile = function(fileId) {
            $http.delete('/api/upload/' + fileId)
                .success(function() {
                    angular.forEach($scope.files, function(u, i) {
                        if(u._id === fileId) {
                            $scope.files.splice(i, 1);
                        }
                    });
                })
                .error(function() {
                    console.log('deleteFile error');
                });
        };

        $scope.onFileSelect = function($files) {
            _.forEach($files, function(file) {
                $scope.photos.push({name: file.name, filename: file.name, info: "", file: file, progress: 0});
            });

            // Kick off the first three uploads
            $scope.nextPhoto = 0;
            if($scope.photos.length > 0) {
                $scope.uploadPhoto($scope.photos[0]);
                $scope.nextPhoto = 1;
                if($scope.photos.length > 1) {
                    $scope.uploadPhoto($scope.photos[1]);
                    $scope.nextPhoto = 2;
                    if($scope.photos.length > 2) {
                        $scope.uploadPhoto($scope.photos[2]);
                        $scope.nextPhoto = 3;
                    }
                }
            }
        };

        $scope.uploadPhoto = function(photo) {
            //TODO: have gallery API take care of this
            $scope.upload = $upload.upload({
                url: 'api/upload',
                method: 'POST',
                file: photo.file,
                data: {
                    name: photo.name,
                    purpose: 'photo'
                }
            })
                .progress(function(evt) {
                    photo.progress = (100.0 * (evt.position / evt.total)).toFixed(1);
                })
                .success(function(data) {
                    photo.thumbnailId = data.thumbnailId;
                    if($scope.photos[$scope.nextPhoto]) {
                        $scope.uploadPhoto($scope.photos[$scope.nextPhoto]);
                        $scope.nextPhoto++;
                    }
                    //TODO: add to gallery
                })
                .error(function(response, status) {
                    photo.err = {status: status, response: response};
                    //TODO: retry
                })
                .xhr(function(xhr) {
                    photo.cancel = function() {
                        xhr.abort();
                    };
                });
        }
    });
