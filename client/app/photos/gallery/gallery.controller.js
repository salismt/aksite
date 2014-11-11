'use strict';

angular.module('aksiteApp')
    .controller('GalleryCtrl', function($scope, $stateParams, $http, $q, Photo, Gallery) {
        $scope.galleryId = $stateParams.galleryId;

        //TODO: make photos load asynchronously
        $scope.photos = [];
        $http.get('/api/gallery/'+$stateParams.galleryId)
            .success(function(gallery) {
                $scope.gridGallery = new CBPGridGallery(document.getElementById('grid-gallery'));
                $scope.gallery = gallery;
                var promises = [];
                _.each(gallery.photos, function(photo) {
                    var promise = $http.get('api/photos/'+photo)
                        .success(function(photo) {
                            $scope.photos.push(photo);
                        });
                    promises.push(promise);
                });
                $q.all(promises)
                    .then(function(results) {
                        $scope.gridGallery._init();
                    });
            })
            .error(function(data, status) {
                $scope.error = status;
            });
    });
