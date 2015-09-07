'use strict';

angular.module('aksiteApp')
    .controller('GalleryEditorCtrl', function($scope, $http, $stateParams, $state, Upload) {
        $scope.photos = [];
        $scope.loadingGallery = true;
        if(!$stateParams.galleryId || $stateParams.galleryId === 'new') {
            $scope.gallery = {
                name: 'Untitled Gallery',
                info: '',
                photos: []
            };
            $scope.loadingGallery = false;
            $scope.newGallery = true;
        } else {
            $http.get('/api/gallery/'+$stateParams.galleryId)
                .success(function(res, status) {
                    $scope.gallery = res;
                    _.forEach($scope.gallery.photos, function(photoId) {
                        $http.get('/api/photos/'+photoId)
                            .success(function(res, status) {
                                $scope.photos.push(res);
                            })
                            .error(function(res, status) {
                                $scope.error = {status: status, res: res};
                            });
                    });
                })
                .error(function(res, status) {
                    $scope.error = {status: status, res: res};
                })
                .finally(function() {
                    $scope.loadingGallery = true;
                });
        }
        var nextPhoto = 0;

        $scope.cancel = function() {
            if($scope.upload)
                $scope.upload.abort();
            $state.go('admin.blog');
        };

        $scope.toggleSelect = (photo) => photo.selected = !photo.selected;

        $scope.onFileSelect = function(files) {
            _.forEach(files, function(file) {
                $scope.photos.push({
                    name: file.name,
                    filename: file.name,
                    info: '',
                    file: file,
                    progress: 0
                });
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
            $scope.upload = Upload.upload({
                url: 'api/upload',
                method: 'POST',
                file: photo.file,
                fields: {
                    name: photo.name,
                    purpose: 'photo'
                },
                headers: {
                    'Content-Type': photo.file.type
                }
            })
                .progress(function(evt) {
                    photo.progress = (100.0 * (evt.loaded / evt.total)).toFixed(1);
                })
                .success(function(data) {
                    photo.thumbnailId = data.thumbnailId;

                    if($scope.photos[nextPhoto]) {
                        $scope.uploadPhoto($scope.photos[nextPhoto++]);
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

        $scope.saveGallery = function() {
            //TODO: also send requests to save $dirty photo names, info
            if($scope.newGallery) {
                $http.post('/api/gallery', $scope.gallery)
                    .success(function(response, status) {
                        console.log(status);
                        console.log(response);
                        $state.go('admin.photos');
                    })
                    .error(function(response, status) {
                        console.log(status);
                        console.log(response);
                    });
            } else {
                $http.put('/api/gallery/'+$stateParams.galleryId, $scope.gallery)
                    .success(function(response, status) {
                        console.log(status);
                        console.log(response);
                        $state.go('admin.photos');
                    })
                    .error(function(response, status) {
                        console.log(status);
                        console.log(response);
                    });
            }
        };
    });
