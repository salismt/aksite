'use strict';

angular.module('aksiteApp')
    .controller('FeaturedmanagerCtrl', function($scope, $http, $mdDialog, $mdToast, $animate) {
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
                .success(function() {
                    $mdToast.show(
                        $mdToast.simple()
                            .content('Rendering Finished')
                            .position('bottom right')
                            .hideDelay(3000)
                        );
                })
                .error(function() {
                    $mdToast.show(
                        $mdToast.simple()
                            .content('Rendering Failed')
                            .position('bottom right')
                            .hideDelay(3000)
                    );
                });
        };

        $scope.deleteItem = function(item, ev) {
            $mdDialog.show($mdDialog.confirm()
                .title('Are you sure you would like to delete this item?')
                .ariaLabel('Delete Item?')
                .ok('Delete')
                .cancel('Cancel')
                .targetEvent(ev))
                .then(() => {
                    $http.delete('/api/featured/'+item._id)
                        .success(function() {
                            $scope.items.splice(this.$index, 1);
                        }.bind(this))
                        .error(function() {
                            $mdToast.show(
                                $mdToast.simple()
                                    .content('Deleting item failed')
                                    .position('bottom right')
                                    .hideDelay(10000)
                            );
                        });
                });
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
