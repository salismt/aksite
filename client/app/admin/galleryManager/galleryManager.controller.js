'use strict';
import _ from 'lodash-es';

export default class GalleryManagerController {
    errors = [];
    loadingGalleries = true;
    galleries = [];
    galleryDeletions = [];
    galleryChanges = [];
    dirty = false;

    /*@ngInject*/
    constructor($http, $state) {
        this.$http = $http;
        this.$state = $state;

        $http.get('/api/gallery')
            .then(res => {
                this.galleries = res.data;
                _.forEach(this.galleries, gallery => {
                    $http.get(`/api/photos/${gallery.featuredId}`)
                        .then(({data: featured}) => {
                            gallery.featured = featured;
                        })
                        .catch(console.log.bind(console));
                });
            })
            .catch(({data, status}) => {
                console.log(data);
                console.log(status);
            })
            .finally(() => {
                this.loadingGalleries = false;
            });
    }

    goToGallery(galleryId) {
        this.$state.go('galleryEditor', {galleryId});
    }

    toggleGalleryDeletion(gallery) {
        if(!gallery.deleted) {
            gallery.deleted = true;
            this.dirty = true;
            this.galleryDeletions.push(gallery);
        } else {
            gallery.deleted = false;
            _.remove(this.galleryDeletions, {_id: gallery._id});
            if(this.galleryDeletions.length === 0) {
                this.dirty = false;
            }
        }
    }

    saveChanges() {
        // Delete galleries
        _.forEach(this.galleryDeletions, gallery => {
            this.$http.delete(`/api/gallery/${gallery._id}`)
                .then(({data, status}) => {
                    _.remove(this.galleries, gallery);
                    this.dirty = false;
                    console.log(data);
                    console.log(status);
                })
                .catch(res => {
                    console.log(res);
                });
        });
    }
}
