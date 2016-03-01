'use strict';

export default class UserEditorController {
    loadingUser = true;
    submitted = false;

    /*@ngInject*/
    constructor($http, $stateParams, $state, $sanitize, Upload, Auth) {
        this.$http = $http;
        this.$stateParams = $stateParams;
        this.$state = $state;
        this.$sanitize = $sanitize;
        this.Upload = Upload;
        this.Auth = Auth;

        this.currentUser = Auth.getCurrentUser();

        if(!$stateParams.userId) {
            this.user = {
                name: 'New User',
                email: 'test@example.com'
            };
            this.loadingUser = false;
        } else {
            $http.get(`/api/users/${$stateParams.userId}`)
                .then(({data}) => {
                    console.log(data);
                    this.user = data;
                    this.filename = this.user.imageId;
                })
                .catch(res => {
                    this.error = res;
                })
                .finally(() => {
                    this.loadingUser = true;
                });
        }
    }

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
    }

    saveUser(form) {
        if(!form.$valid) return;

        this.submitted = true;

        let options = {
            url: `api/users/${this.user._id}`,
            method: 'PUT',
            fields: this.user
        };

        if(this.filename !== this.user.imageId && this.filename !== null) {
            options.fields.newImage = true;
            options.file = this.fileToUpload;
            options.headers = {
                'Content-Type': this.fileToUpload.type
            };
        }

        this.upload = this.Upload.upload(options);

        this.upload
            .progress(evt => {
                this.progress = (100.0 * (evt.loaded / evt.total)).toFixed(1);
            })
            .then(({data, status}) => {
                this.progress = undefined;
                console.log(status);
                console.log(data);
                this.$state.go('admin.users');
            })
            .catch(({data, status}) => {
                this.progress = undefined;
                console.log(status);
                console.log(data);
            });

        this.upload
            .xhr(xhr => {
                this.abort = function() {
                    xhr.abort();
                };
            });
    }

    cancel() {
        if(this.upload) {
            this.upload.abort();
        }
        this.$state.go('admin.users');
    }
}
