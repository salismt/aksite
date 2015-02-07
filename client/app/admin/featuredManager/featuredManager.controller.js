'use strict';

angular.module('aksiteApp')
    .controller('FeaturedmanagerCtrl', function($scope, $http) {
        $scope.loadingItems = true;
        $http.get('/api/featured/items')
            .success(function(data) {
                console.log(data);
                $scope.items = data;
            })
            .error(function(err, status) {
                console.log(err);
                console.log(status);
            });

        $scope.newFeaturedSection = function() {
            $http.get('/api/featured/new')
                .success(function(data, status) {
                    console.log(status);
                });
        };

        $scope.deleteItem = function(item) {
            //TODO
        };
    })
    .directive('bgImg', function() {
        return function(scope, element, attrs){
            var url = attrs.bgImg;
            element.css({
                'background-image': 'url(' + url + ')',
                'background-repeat': 'no-repeat',
                'background-position-x': '50%',
                'background-position-y': '50%',
                'background-size': 'cover'
            });
        };
    });
