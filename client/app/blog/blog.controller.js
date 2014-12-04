'use strict';

angular.module('aksiteApp')
    .controller('BlogCtrl', function($scope, $http, $stateParams) {
        $scope.page = 1;

        $scope.posts = [];

        var getterString = 'api/posts';
        var queryParams = [];
        if($stateParams.page)
            queryParams.push('page='+$stateParams.page);
        if($stateParams.pagesize)
            queryParams.push('pagesize='+$stateParams.pagesize);
        if(queryParams.length > 0) {
            getterString += '?';
            _.forEach(queryParams, function(param, index) {
                getterString += param;
                if(index < queryParams.length-1)
                    getterString += '&';
            })
        }
        console.log(getterString);
        $http.get(getterString)
            .success(function(posts) {
                $scope.posts = posts;
                _.forEach($scope.posts, function(post) {
                    post.date = moment(post.date).format("LL");
                    post.subheader = marked(post.subheader);
                });
                console.log($scope.posts);
            })
            .error(function(err) {
                console.log(err);
            });
    });
