'use strict';

angular.module('aksiteApp')
    .controller('PhotosManagerCtrl', function ($scope, Photo) {
        $scope.photo = {
            hidden: false
        };
        $scope.errors = {};

        // Use the User $resource to fetch all users
        $scope.photos = Photo.query();

        $scope.addPhoto = function(form) {
            console.log(Photo);

            $scope.submitted = true;

            if (form.$valid) {
                Photo.save({
                    name: $scope.photo.name,
                    info: $scope.photo.info || '',
                    active: true
                })
                .catch(function (err) {
                    err = err.data;
                    $scope.errors.other = err.message;

                    // Update validity of form fields that match the mongoose errors
                    angular.forEach(err.errors, function(error, field) {
                        form[field].$setValidity('mongoose', false);
                        $scope.errors[field] = error.message;
                    });
                });
                $scope.photos = Photo.query();
            }
        };

        $scope.deletePhoto = function (photo) {
            Photo.remove({ id: photo._id });
            angular.forEach($scope.photos, function (u, i) {
                if (u === photo) {
                    $scope.photos.splice(i, 1);
                }
            });
        };
    });
