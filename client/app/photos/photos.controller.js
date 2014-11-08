'use strict';

angular.module('aksiteApp')
    .controller('PhotosCtrl', function($scope, Photo, Gallery) {
        $scope.gallery = new CBPGridGallery(document.getElementById('grid-gallery'));
        // Use the User $resource to fetch all users
        $scope.photos = Photo.query(function(val) {
            setTimeout(function() {
                $scope.gallery._init();
            }, 1);
        });
        $scope.galleries = Gallery.query(function(val) {
            console.log(val);
            //setTimeout(function() {
            //    $scope.gallery._init();
            //}, 1);
        });
    });
