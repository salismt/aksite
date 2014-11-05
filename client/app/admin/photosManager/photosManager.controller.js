'use strict';

angular.module('aksiteApp')
    .controller('PhotosManagerCtrl', function($scope, $http, $upload, Photo) {
        $scope.photo = {
            hidden: false
        };
        $scope.errors = {};
        $scope.dropSupported = true;

        $scope.gallery = new CBPGridGallery( document.getElementById( 'grid-gallery' ) );
        // Use the User $resource to fetch all users
        $scope.photos = Photo.query(function(val) {
            setTimeout(function() {
                $scope.gallery._init();
            }, 1);
        });

        $scope.files = [];
        $http.get('/api/upload').success(function (files) {
            $scope.files = files;
        });

        $scope.addPhoto = function(form) {
            console.log(form);

            $scope.submitted = true;

            if(form.$valid) {
                $upload.upload({
                    url: 'api/upload',
                    method: 'POST',
                    file: $scope.fileToUpload,
                    data: {
                        name: $scope.photo.name,
                        info: $scope.photo.info,
                        purpose: 'photo'
                    }})
                    .progress(function(evt) {
                        console.log(evt);
                    })
                    .success(function(data) {
                        console.log(data);
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
            $http.delete('/api/upload/'+fileId)
                .success(function () {
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
