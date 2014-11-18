'use strict';

angular.module('aksiteApp')
    .controller('GalleryEditorCtrl', function($scope, $http, $upload) {
        $scope.gallery = {
            name: 'Untitled Gallery',
            info: '',
            photos: []
        };
        $scope.photos = [];
        var nextPhoto = 0;

        $scope.onFileSelect = function($files) {
            _.forEach($files, function(file) {
                $scope.photos.push({name: file.name, filename: file.name, info: "", file: file, progress: 0});
            });

            // Kick off the first three uploads
            if($scope.photos.length > 0) {
                $scope.uploadPhoto($scope.photos[0]);
                nextPhoto = 1;
                if($scope.photos.length > 1) {
                    $scope.uploadPhoto($scope.photos[1]);
                    nextPhoto = 2;
                    if($scope.photos.length > 2) {
                        $scope.uploadPhoto($scope.photos[2]);
                        nextPhoto = 3;
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
                    if($scope.photos[nextPhoto]) {
                        $scope.uploadPhoto($scope.photos[nextPhoto]);
                        nextPhoto++;
                    }
                    $scope.gallery.photos.push(data._id);
                })
                .error(function(response, status) {
                    photo.err = {status: status, response: response};
                    //TODO: retry, show error
                })
                .xhr(function(xhr) {
                    photo.cancel = function() {
                        xhr.abort();
                    };
                });
        };

        $scope.saveGallery = function(form) {
            $http.post('/api/gallery', $scope.gallery)
                .success(function(response, status) {
                    console.log(status);
                    console.log(response);
                })
                .error(function(response, status) {
                    console.log(status);
                    console.log(response);
                });
        };
    });
