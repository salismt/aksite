'use strict';
import _ from 'lodash-es';

export default class GalleriesController {
    /*@ngInject*/
    constructor($http, Gallery, $state) {
        this.$state = $state;

        this.galleries = Gallery.query(() => {
            _.forEach(this.galleries, gallery => {
                $http.get(`/api/photos/${gallery.featuredId}`)
                    .then(({data: photo}) => {
                        gallery.featuredImgId = photo.thumbnailId;
                    });
            });
        });
    }

    goToGallery(id) {
        this.$state.go('gallery', {galleryId: id});
    }
}
