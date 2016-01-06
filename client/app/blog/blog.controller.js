'use strict';

import moment from 'moment';
import marked from 'marked';

export default class BlogController {
    loadingItems = true;
    noItems = false;
    page = 1;
    pagesize = 10;
    posts = [];

    /*@ngInject*/
    constructor($http, $stateParams, $state) {
        this.$http = $http;
        this.$stateParams = $stateParams;
        this.$state = $state;

        $state.reloadOnSearch = false;

        this.page = $stateParams.page || 1;
        this.pagesize = $stateParams.pagesize || 10;

        this.pageChanged();
    }

    pageChanged() {
        this.$http.get(this.getterString())
            .success(response => {
                this.currentPage = response.page;
                this.pages = response.pages;
                this.numItems = response.numItems;
                this.posts = response.items;
                _.forEach(this.posts, post => {
                    post.date = moment(post.date).format('LL');
                    post.subheader = marked(post.subheader);
                });
                this.noItems = response.items.length <= 0;
                document.body.scrollTop = document.documentElement.scrollTop = 0;
            })
            .error(function(err) {
                console.log(err);
            });
    }

    getterString() {
        var str = 'api/posts';
        var queryParams = [];
        if(this.page) {
            queryParams.push('page=' + this.page);
        }
        if(this.$stateParams.pagesize) {
            queryParams.push('pagesize=' + this.$stateParams.pagesize);
        }
        if(queryParams.length > 0) {
            str += '?';
            _.forEach(queryParams, function(param, index) {
                str += param;
                if(index < queryParams.length-1) {
                    str += '&';
                }
            });
        }
        return str;
    }
}
