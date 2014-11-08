'use strict';

angular.module('aksiteApp')
    .controller('PhotosCtrl', function($scope, $http, Photo, Gallery) {
        $scope.gallery = new CBPGridGallery(document.getElementById('grid-gallery'));

        //TODO: make galleries load asynchronously
        $scope.galleries = Gallery.query(function(val) {
            console.log(val);
            _.forEach($scope.galleries, function(gallery) {
                $http.get('/api/photos/'+gallery.featuredId)
                    .success(function(photo) {
                        gallery.featuredImgId = photo.thumbnailId;
                    });
            });
            setTimeout(function() {
                $scope.gallery._init();
            }, 1);
        });
    });
