'use strict';
import moment from 'moment';
import { Converter } from 'showdown';
const converter = new Converter();

export default class PostController {
    /*@ngInject*/
    constructor($rootScope, $stateParams, $http, $sce) {
        this.postId = $stateParams.postId;

        $http.get(`api/posts/${this.postId}`)
            .success(post => {
                this.post = post;

                $rootScope.title += ` | ${post.title}`;

                this.post.content = $sce.trustAsHtml(converter.makeHtml(this.post.content));
                this.post.date = moment(this.post.date).format('LL');
            })
            .error(err => {
                console.log(err);
                this.error = err;
            });
    }
}
