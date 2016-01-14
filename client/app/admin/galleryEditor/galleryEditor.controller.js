'use strict';

export default class GalleryEditorController {
    photos = [];
    loadingGallery = true;
    nextPhoto = 0;

    /*@ngInject*/
    constructor($http, $stateParams, $state, Upload) {
        this.$http = $http;
        this.$stateParams = $stateParams;
        this.$state = $state;
        this.Upload = Upload;

        if(!$stateParams.galleryId || $stateParams.galleryId === 'new') {
            this.gallery = {
                name: 'Untitled Gallery',
                info: '',
                photos: []
            };
            this.loadingGallery = false;
            this.newGallery = true;
        } else {
            $http.get('/api/gallery/' + $stateParams.galleryId)
                .then(({data}) => {
                    this.gallery = data;
                    this.nextPhoto = this.gallery.photos.length;
                    _.forEach(this.gallery.photos, photoId => {
                        $http.get('/api/photos/' + photoId)
                            .then(res => {
                                this.photos.push(res.data);
                            })
                            .catch(res => {
                                this.error = {status: res.status, data: res.data};
                            });
                    });
                })
                .catch(res => {
                    this.error = {status: res.status, data: res.data};
                })
                .finally(() => {
                    this.loadingGallery = false;
                });
        }
    }

    cancel() {
        if(this.upload) {
            this.upload.abort();
        }
        this.$state.go('admin.galleries');
    };

    toggleSelect(photo) {
        photo.selected = !photo.selected;
    }

    // FIXME: works when first creating a gallery, but not when adding photos when we already have some
    onFileSelect(files) {
        if(!files || !files.length) return;

        _.forEach(files, file => {
            this.photos.push({
                name: file.name,
                filename: file.name,
                info: '',
                file: file,
                progress: 0
            });
        });

        // Kick off the first three uploads
        if(files.length > 0) {
            this.uploadPhoto(this.photos[this.nextPhoto]);
            this.nextPhoto++;
            if(files.length > 1) {
                this.uploadPhoto(this.photos[this.nextPhoto]);
                this.nextPhoto++;
                if(files.length > 2) {
                    this.uploadPhoto(this.photos[this.nextPhoto]);
                    this.nextPhoto++;
                }
            }
        }
    };

    uploadPhoto(photo) {
        this.upload = this.Upload.upload({
            url: 'api/upload',
            method: 'POST',
            file: photo.file,
            fields: {
                name: photo.name,
                purpose: 'photo'
            },
            headers: {
                'Content-Type': photo.file.type
            }
        })
            .progress(evt => {
                photo.progress = (100.0 * (evt.loaded / evt.total)).toFixed(1);
            })
            .success(data => {
                photo.thumbnailId = data.thumbnailId;

                if(this.photos[this.nextPhoto]) {
                    this.uploadPhoto(this.photos[this.nextPhoto++]);
                }

                this.gallery.photos.push(data._id);
            })
            .error((response, status) => {
                photo.err = {status: status, response: response};
                //TODO: retry, show error
            })
            .xhr(xhr => {
                photo.cancel = function() {
                    xhr.abort();
                };
            });
    };

    saveGallery() {
        //TODO: also send requests to save $dirty photo names, info
        if(this.newGallery) {
            this.$http.post('/api/gallery', this.gallery)
                .then(({data, status}) => {
                    console.log(status);
                    console.log(data);
                    this.$state.go('admin.galleries');
                })
                .catch(({data, status}) => {
                    console.log(status);
                    console.log(data);
                });
        } else {
            this.$http.put('/api/gallery/' + this.$stateParams.galleryId, this.gallery)
                .then(({data, status}) => {
                    console.log(status);
                    console.log(data);
                    this.$state.go('admin.galleries');
                })
                .catch(({data, status}) => {
                    console.log(status);
                    console.log(data);
                });
        }
    };
};
