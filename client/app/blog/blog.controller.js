'use strict';

function getterString(page, pagesize) {
    var str = 'api/posts';
    var queryParams = [];
    if(page)
        queryParams.push('page=' + page);
    if(pagesize)
        queryParams.push('pagesize=' + pagesize);
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

class BlogController {
    noItems = false;
    page = 0;
    pagesize = 10;
    posts = [];

    constructor($http, $stateParams, $state) {
        this.$http = $http;
        this.$stateParams = $stateParams;
        this.$state = $state;

        this.page = this.$stateParams.page || 1;
        this.pagesize = this.$stateParams.pagesize || 10;

        $state.reloadOnSearch = false;

        this.pageChanged();
    }

    pageChanged() {
        this.$http.get(getterString(this.page, this.$stateParams.pagesize))
            .success(response => {
                //this.currentPage = response.page;
                this.pages = response.pages;
                this.numItems = response.numItems;
                this.posts = response.items;
                _.forEach(this.posts, post => {
                    post.date = moment(post.date).format("LL");
                    post.subheader = marked(post.subheader);
                });
                this.noItems = response.items.length <= 0;
                document.body.scrollTop = document.documentElement.scrollTop = 0;
            })
            .error(function(err) {
                console.log(err);
            });
    };
}

angular.module('aksiteApp')
    .controller('BlogCtrl', BlogController);
