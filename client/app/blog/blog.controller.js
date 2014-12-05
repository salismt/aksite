'use strict';

angular.module('aksiteApp')
    .controller('BlogCtrl', function($scope, $http, $stateParams, $state, $location) {
        $state.reloadOnSearch = false;

        $scope.loadingItems = true;
        $scope.noItems = false;
        $scope.page = $stateParams.page || 1;
        $scope.pagesize = $stateParams.pagesize || 10;
        $scope.posts = [];

        $scope.pageChanged = function() {
            $http.get(getterString())
                .success(function(response) {
                    $scope.currentPage = response.page;
                    $scope.pages = response.pages;
                    $scope.numItems = response.numItems;
                    $scope.posts = response.items;
                    _.forEach($scope.posts, function(post) {
                        post.date = moment(post.date).format("LL");
                        post.subheader = marked(post.subheader);
                    });
                    $scope.noItems = response.items.length <= 0;
                    document.body.scrollTop = document.documentElement.scrollTop = 0;
                })
                .error(function(err) {
                    console.log(err);
                });
        };
        $scope.pageChanged();

        function getterString() {
            var str = 'api/posts';
            var queryParams = [];
            if($scope.page)
                queryParams.push('page='+$scope.page);
            if($stateParams.pagesize)
                queryParams.push('pagesize='+$stateParams.pagesize);
            if(queryParams.length > 0) {
                str += '?';
                _.forEach(queryParams, function(param, index) {
                    str += param;
                    if(index < queryParams.length-1)
                        str += '&';
                })
            }
            return str;
        }
    });
