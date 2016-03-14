'use strict';
import angular from 'angular';
import _ from 'lodash-es';
import Promise from 'bluebird';

import 'jquery';
import 'jquery-bridget';
import 'desandro-get-style-property/get-style-property';
import 'get-size/get-size';
import 'wolfy87-eventemitter/EventEmitter';
import 'eventie/eventie';
import 'doc-ready/doc-ready';
import 'desandro-matches-selector/matches-selector';
import 'fizzy-ui-utils/utils';
import 'outlayer/item';
import 'outlayer/outlayer';
import Masonry from 'masonry-layout';
import 'imagesloaded/imagesloaded';

import MiniDaemon from '../../components/minidaemon';

export default class GalleriesController {
    msnry;

    /*@ngInject*/
    constructor($http, Gallery, $state, $rootScope, $scope, $compile) {
        this.masonryContainerElement = document.getElementById('masonry-container');
        this.$state = $state;

        let addGallery = (gallery, i) => {
            let container = angular.element(`<div class="brick card md-whiteframe-z1" ng-click="vm.goToGallery('${gallery._id}')"></div>`);
            container.attr('id', gallery._id);
            container = $compile(container)($scope);

            let item = angular.element('<div class="item"></div>');
            let img = angular.element(`<img src="/api/upload/${gallery.featuredImageId}.jpg" alt="">`);
            item.append(img);
            container.append(item);

            let cardContent = angular.element('<div class="card-content"></div>');
            let title = angular.element(`<h2 class="md-title">${gallery.name}</h2>`);
            let description = angular.element(`<p>${gallery.info}</p>`);
            cardContent.append(title);
            cardContent.append(description);
            container.append(cardContent);

            angular.element(this.masonryContainerElement).append(container);

            if(i === 0) {
                this.msnry = new Masonry(this.masonryContainerElement, {
                    itemSelector: '.brick',
                    transitionDuration: '0.4s',
                    gutter: 20
                });
            } else {
                this.msnry.appended(document.getElementById(gallery._id));
                this.msnry.layout();
            }
        };


        $rootScope.$on('$stateChangeStart', () => {
            if(this.msnry) {
                this.msnry.destroy();
            }
            addGallery = _.noop;
        });

        Gallery.query().$promise
            .then(galleries => {
                Reflect.deleteProperty(galleries, '$promise');
                Reflect.deleteProperty(galleries, '$resolved');
                return Promise.map(galleries, gallery => $http.get(`api/photos/${gallery.featuredId}`))
                    .then(featureImages => {
                        _.forEach(featureImages, ({data: image}, i) => {
                            galleries[i].featuredImageId = image.fileId;
                        });

                        this.galleries = galleries;

                        let i = 0;
                        let daemon = new MiniDaemon(this, () => {
                            addGallery(this.galleries[i], i++);
                        }, 50, this.galleries.length);
                        daemon.start();
                    });
            })
            .catch(res => {
                this.errors.push(res);
            });
    }

    goToGallery(id) {
        this.$state.go('gallery', {galleryId: id});
    }
}
