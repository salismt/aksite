import angular from 'angular';
import uirouter from 'angular-ui-router';
import {Component} from '@angular/core';
import {upgradeAdapter} from '../../../app/upgrade_adapter';

import routes from './post.routes';

import moment from 'moment';
import { Converter } from 'showdown';
const converter = new Converter();

@Component({
    selector: 'post',
    template: require('./post.html'),
    styles: [require('./post.scss')]
})
export class PostComponent {
    error;
    post = {author: {}};

    static parameters = ['$rootScope', '$stateParams', '$http', '$sce'];
    constructor($rootScope, $stateParams, $http, $sce) {
        this.postId = $stateParams.postId;

        this.$http = $http;
        this.$rootScope = $rootScope;
        this.$sce = $sce;
    }

    ngOnInit() {
        return this.$http.get(`api/posts/${this.postId}`)
            .then(({data: post}) => {
                this.post = post;

                this.$rootScope.title += ` | ${post.title}`;

                this.post.content = this.$sce.trustAsHtml(converter.makeHtml(this.post.content));
                this.post.date = moment(this.post.date).format('LL');
            })
            .catch(err => {
                console.log(err);
                this.error = err;
            });
    }
}

export default angular.module('aksiteApp.blog.post', [uirouter])
    .config(routes)
    .directive('post', upgradeAdapter.downgradeNg2Component(PostComponent))
    .name;
