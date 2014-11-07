'use strict';

angular.module('aksiteApp')
    .controller('PhotomanagerCtrl', function($scope, $http, Photo) {
        $scope.photo = {
            hidden: false
        };
        $scope.errors = {};
        $scope.dropSupported = true;
        $scope.progress = undefined;

        $scope.gallery = new CBPGridGallery(document.getElementById('grid-gallery'));
        // Use the User $resource to fetch all users
        $scope.photos = Photo.query(function(val) {
            setTimeout(function() {
                $scope.gallery._init();
            }, 1);
        });

        $scope.files = [];
        $http.get('/api/upload').success(function(files) {
            $scope.files = files;
        });

        $scope.featurePhoto = function(photo) {
            $http.post('/api/featured/'+photo._id, {
                type: 'photo',
                name: photo.name,
                link: ''
            })
                .success(function(data, status, headers, config) {
                    console.log(status);
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                    console.log(status);
                });
        };

        $scope.addPhoto = function(form) {
            console.log(form);

            $scope.submitted = true;

            if(form.$valid) {
                $scope.upload = $upload.upload({
                    url: 'api/upload',
                    method: 'POST',
                    file: $scope.fileToUpload,
                    data: {
                        name: $scope.photo.name,
                        info: $scope.photo.info,
                        purpose: 'photo'
                    }
                })
                    .progress(function(evt) {
                        $scope.progress = (100.0 * (evt.position / evt.total)).toFixed(1);
                        console.log(evt);
                    })
                    .success(function(data) {
                        $scope.progress = undefined;
                        //console.log(data);
                        $scope.photos = Photo.query();
                    })
                    .error(function(response, status, headers, config) {
                        $scope.progress = undefined;
                    })
                    .xhr(function(xhr) {
                        // to abort, use ng-click like: ng-click="abort()"
                        $scope.abort = function() {
                            xhr.abort();
                        };
                    });
            }
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
            //$files: an array of files selected, each file has name, size, and type.
            var file = $files[0];

            $scope.filename = file.name;
            $scope.fileToUpload = file;
        };
    });
