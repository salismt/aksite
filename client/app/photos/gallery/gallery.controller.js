'use strict';

angular.module('aksiteApp')
    .controller('GalleryCtrl', function($scope, $stateParams, $http, Photo, Gallery) {
        $scope.galleryId = $stateParams.galleryId;

        $scope.gridGallery = new CBPGridGallery(document.getElementById('grid-gallery'));

        //TODO: make galleries load asynchronously
        $scope.photos = [];
        $http.get('/api/gallery/'+$stateParams.galleryId)
            .success(function(gallery) {
                $scope.gallery = gallery;
                _.each(gallery.photos, function(photo) {
                    $http.get('api/photos/'+photo)
                        .success(function(photo) {
                            $scope.photos.push(photo);
                            //console.log($scope.gridGallery);
                            $scope.gridGallery._init();
                        });
                });
            })
            .error(function(data, status) {
                $scope.error = status;
            });
    });
