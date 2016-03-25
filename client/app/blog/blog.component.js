'use strict';
import {Component} from 'angular2/core';
import {upgradeAdapter} from '../../app/upgrade_adapter';
import {NgbPagination} from 'angular-ng-bootstrap';

import {wrapperLodash as _, mixin} from 'lodash-es';
import {
    forEach
} from 'lodash-es';
mixin(_, {
    forEach
});
import moment from 'moment';
import { Converter } from 'showdown';
const converter = new Converter();

@Component({
    selector: 'blog',
    template: require('./blog.html'),
    styles: [require('./blog.scss')],
    directives: [NgbPagination]
})
export class BlogComponent {
    loadingItems = true;
    noItems = false;
    page = 0;
    pagesize = 10;
    collectionSize = 0;
    posts = [];

    static parameters = ['$http', '$stateParams', '$state'];
    constructor($http, $stateParams, $state) {
        this.$http = $http;
        this.$stateParams = $stateParams;
        this.$state = $state;

        $state.reloadOnSearch = false;

        this.page = $stateParams.page || 1;
        this.pagesize = $stateParams.pagesize || 10;
    }

    ngOnInit() {
        this.pageChanged(this.page);
    }

    pageChanged(page) {
        this.page = page;
        this.$state.transitionTo('blog', {page: this.page, pagesize: this.pagesize}, { notify: false });

        return this.$http.get(`api/posts?page=${this.page}&pagesize=${this.pagesize}`)
            .then(({data}) => {
                this.pages = data.pages;
                this.collectionSize = data.numItems;
                this.posts = data.items;
                _.forEach(this.posts, post => {
                    post.date = moment(post.date).format('LL');
                    post.subheader = converter.makeHtml(post.subheader);
                });
                this.noItems = data.items.length <= 0;
                document.body.scrollTop = document.documentElement.scrollTop = 0;
            })
            .catch(function(err) {
                console.log(err);
            });
    }
}

import angular from 'angular';
import uirouter from 'angular-ui-router';

import post from './post';

import routing from './blog.routes';

export default angular.module('aksiteApp.blog', [uirouter, post])
    .config(routing)
    .directive('blog', upgradeAdapter.downgradeNg2Component(BlogComponent))
    .name;
