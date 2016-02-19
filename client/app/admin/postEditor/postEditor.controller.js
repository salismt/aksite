'use strict';

import marked from 'marked';

export default class PostEditorController {
    loadingPost = true;
    submitted = false;

    /*@ngInject*/
    constructor($http, $stateParams, $state, $sce, Upload, Auth) {
        this.$http = $http;
        this.$stateParams = $stateParams;
        this.$state = $state;
        this.$sce = $sce;
        this.Upload = Upload;
        this.Auth = Auth;

        this.currentUser = Auth.getCurrentUser();

        if(!$stateParams.postId || $stateParams.postId === 'new') {
            this.post = {
                title: 'Untitled Post',
                subheader: undefined,
                alias: undefined,
                hidden: false,
                author: {
                    name: this.currentUser.name,
                    id: this.currentUser._id,
                    imageId: this.currentUser.imageId,
                    smallImageId: this.currentUser.smallImageId
                },
                date: new Date(),
                imageId: undefined,
                content: undefined,
                categories: []
            };
            this.loadingPost = false;
            this.newPost = true;
        } else {
            $http.get('/api/posts/' + $stateParams.postId)
                .then(({data}) => {
                    this.post = data;
                    this.post.categories = this.post.categories.join(', ');
                    this.filename = this.post.imageId;
                    if(this.post.hidden !== true && this.post.hidden !== false) {
                        this.post.hidden = false;
                    }
                })
                .catch(({data, status}) => {
                    this.error = {data, status};
                })
                .finally(() => {
                    this.loadingPost = true;
                });
        }
    }

    markedContent() {
        try {
            return this.$sce.trustAsHtml(marked(this.post.content || ''));
        } catch(e) {
            return '<h1 class=\"text-danger\">Parsing Error</h1>';
        }
    };

    cancel() {
        if(this.upload) this.upload.abort();
        this.$state.go('admin.blog');
    };

    onFileSelect($files) {
        //$files: an array of files selected, each file has name, size, and type.
        var file = $files[0];

        if(!file) {
            this.filename = null;
            this.fileToUpload = null;
        } else {
            this.filename = file.name;
            this.fileToUpload = file;
        }
    };

    savePost(form) {
        if(!form.$valid) { return; }

        this.submitted = true;

        var options = {
            url: this.newPost ? 'api/posts/' : `api/posts/${this.post._id}`,
            method: this.newPost ? 'POST' : 'PUT',
            fields: {
                title: this.post.title,
                subheader: this.post.subheader,
                alias: this.post.alias,
                author: this.post.author,
                date: this.post.date,
                content: this.post.content,
                categories: this.post.categories,
                hidden: this.post.hidden
            }
        };

        // Uploading image
        if(this.fileToUpload && !(this.filename === this.post.imageId || this.filename === null)) {
            if(!this.newPost) {
                options.fields.newImage = true;
            }

            options.file = this.fileToUpload;
            options.headers = {
                'Content-Type': this.fileToUpload.type
            };
        }

        // convert categories string to array of strings
        if(typeof options.fields.categories === 'string') {
            options.fields.categories = _.map(options.fields.categories.split(','), _.trim);
        }

        this.upload = this.Upload.upload(options);

        this.upload
            .progress((evt) => {
                this.progress = (100.0 * (evt.loaded / evt.total)).toFixed(1);
            })
            .then(({data, status}) => {
                this.progress = undefined;
                console.log(status);
                console.log(data);
                this.$state.go('admin.blog');
            })
            .catch(({data, status}) => {
                this.progress = undefined;
                console.log(status);
                console.log(data);
            });

        this.upload
            .xhr((xhr) => {
                this.abort = function() {
                    xhr.abort();
                };
            });
    };
}
