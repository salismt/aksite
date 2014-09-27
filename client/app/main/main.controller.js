'use strict';

angular.module('aksiteApp')
    .controller('MainCtrl', function ($scope, $http, socket) {
        $scope.awesomeThings = [];
        $scope.photos = [];

        $http.get('/api/photos').success(function (photos) {
            $scope.photos = photos;
//            _.each($scope.photos, function(photo) {
//                $http.get('/api/photos/'+photo._id).success(function(photoData) {
//                    console.log(photoData);
//                    photo.data = photoData.src;
//                });
//            });
        });

        $http.get('/api/things').success(function (awesomeThings) {
            $scope.awesomeThings = awesomeThings;
            socket.syncUpdates('thing', $scope.awesomeThings);
        });

        $scope.addThing = function () {
            if ($scope.newThing === '') {
                return;
            }
            $http.post('/api/things', { name: $scope.newThing });
            $scope.newThing = '';
        };

        $scope.deleteThing = function (thing) {
            $http.delete('/api/things/' + thing._id);
        };

        $scope.$on('$destroy', function () {
            socket.unsyncUpdates('thing');
        });
    });