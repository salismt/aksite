'use strict';

angular.module('aksiteApp')
    .controller('GalleryCtrl', function($scope, $stateParams, $http, $q) {
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
                            photo.done = false;
                            $scope.photos.push(photo);
                            imagesLoaded('#photo-'+photo._id+' img', function(instance) {
                                console.log(instance);
                            })
                                .on('done', function(instance) {
                                    var figure = document.getElementById('photo-'+photo._id);
                                    figure.className = figure.className + ' done';
                                });
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
