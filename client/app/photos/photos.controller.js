'use strict';

angular.module('aksiteApp')
    .controller('PhotosCtrl', function($scope, $http, Photo, Gallery) {
        $scope.galleries = Gallery.query(function(val) {
            _.forEach($scope.galleries, function(gallery) {
                $http.get('/api/photos/'+gallery.featuredId)
                    .success(function(photo) {
                        gallery.featuredImgId = photo.thumbnailId;
                    });
            });
        });
    });
