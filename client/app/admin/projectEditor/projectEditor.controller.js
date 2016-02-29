'use strict';
import _ from 'lodash';
import { Converter } from 'showdown';
const converter = new Converter();

export default class ProjectEditorController {
    loadingProject = true;
    submitted = false;
    project = {
        name: '',
        info: undefined,
        file: null,
        content: undefined,
        hidden: false
    };

    /*@ngInject*/
    constructor($http, $stateParams, $state, $sanitize, Upload) {
        this.$http = $http;
        this.$stateParams = $stateParams;
        this.$state = $state;
        this.$sanitize = $sanitize;
        this.Upload = Upload;

        if(!$stateParams.projectId || $stateParams.projectId === 'new') {
            this.project = {
                name: 'Untitled Project',
                info: undefined,
                file: null,
                content: undefined,
                hidden: false
            };
            this.loadingProject = false;
            this.newProject = true;
        } else {
            $http.get('/api/projects/' + $stateParams.projectId)
                .then((res) => {
                    this.project = res.data;
                    this.filename = this.project.coverId;
                    if(this.project.hidden !== true && this.project.hidden !== false) {
                        this.project.hidden = false;
                    }
                })
                .catch((res) => {
                    this.error = res;
                })
                .finally(() => {
                    this.loadingProject = true;
                });
        }
    }

    cancel() {
        if(this.upload) {
            this.upload.abort();
            this.submitted = false;
        }
        this.$state.go('admin.projects');
    };

    markedContent() {
        try {
            return this.$sanitize(converter.makeHtml(this.project.content || ''));
        } catch(e) {
            return `<h1 class="text-danger">Parsing Error</h1>
                    <span class="break-word">${_.escape(e)}</span>`;
        }
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

    saveProject() {
        this.submitted = true;

        var options = {
            url: this.newProject ? 'api/projects/' : `api/projects/${this.project._id}`,
            method: this.newProject ? 'POST' : 'PUT',
            fields: {
                name: this.project.name,
                info: this.project.info,
                content: this.project.content,
                hidden: this.project.hidden
            }
        };

        // Uploading image
        if(this.fileToUpload && !(this.filename === this.project.coverId || this.filename === null)) {
            if(!this.newProject) {
                options.fields.newImage = true;
            }

            options.file = this.fileToUpload;
            options.headers = {
                'Content-Type': this.fileToUpload.type
            };
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
                this.$state.go('admin.projects');
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
};
