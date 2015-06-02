'use strict';

angular.module('aksiteApp')
    .controller('PhotomanagerCtrl', function($scope, $http, $state) {
        $scope.errors = [];
        $scope.loadingGalleries = true;
        $scope.galleries = [];
        $scope.galleryDeletions = [];
        $scope.galleryChanges = [];
        $scope.dirty = false;

        $http.get('/api/gallery')
            .success(function(res) {
                $scope.galleries = res;
                _.forEach($scope.galleries, function(gallery) {
                    $http.get('/api/photos/'+gallery.featuredId)
                        .success(function(res) {
                            gallery.featured = res;
                        })
                        .error(function(res, status) {
                            console.log(res);
                            console.log(status);
                        });
                });
            })
            .error(function(res, status) {
                console.log(res);
                console.log(status);
            })
            .finally(function() {
                $scope.loadingGalleries = false;
            });

        $scope.goToGallery = function(id, event) {
            $state.go('galleryEditor', {galleryId: id});
        };

        $scope.toggleGalleryDeletion = function(gallery) {
            if(!gallery.deleted) {
                gallery.deleted = true;
                $scope.dirty = true;
                $scope.galleryDeletions.push(gallery);
            } else {
                gallery.deleted = false;
                _.remove($scope.galleryDeletions, (thisGallery) => thisGallery._id === gallery._id);
                if($scope.galleryDeletions.length === 0) {
                    $scope.dirty = false;
                }
            }
        };

        $scope.saveChanges = function() {
            // Delete galleries
            _.forEach($scope.galleryDeletions, function(gallery) {
                $http.delete('/api/gallery/'+gallery._id)
                    .success(function(res, status) {
                        _.remove($scope.galleries, gallery);
                        $scope.dirty = false;
                        console.log(res);
                        console.log(status);
                    })
                    .error(function(res, status) {
                        console.log(res);
                        console.log(status);
                    });
            });
        };
    });
