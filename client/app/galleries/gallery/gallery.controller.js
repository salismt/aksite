'use strict';
import _ from 'lodash-es';
import angular from 'angular';

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

import PhotoSwipe from 'photoswipe';
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';

import MiniDaemon from '../../../components/minidaemon';

function photoToPSWP(photo, index) {
    return {
        src: `api/upload/${photo.fileId}`,
        msrc: `api/upload/${photo.thumbnailId}`,
        w: photo.width,
        h: photo.height,
        index
    };
}

export default class GalleryController {
    galleryId;
    errors = [];
    photos = [];
    pswpPhotos = [];
    masonryContainerElement;
    items = [];
    msnry;

    /*@ngInject*/
    constructor($rootScope, $scope, $stateParams, $http, $compile) {
        this.masonryContainerElement = document.getElementById('masonry-container');
        this.galleryId = $stateParams.galleryId;

        let addPhoto = (photo, i) => {
            photo.index = this.photos.length;

            let div = angular.element('<div></div>');
            div.attr('class', 'brick');
            div.attr('data-size', `${photo.width}x${photo.height}`);
            div.attr('id', `/api/upload/${photo.fileId}.jpg`);

            let img = angular.element('<img>');
            img.attr('src', `/api/upload/${photo.thumbnailId}.jpg`);
            img.attr('alt', '');
            img.attr('ng-click', `vm.onThumbnailsClick(${photo.index})`);
            img = $compile(img)($scope);
            div.append(img);

            angular.element(document.getElementById('masonry-container')).append(div);

            if(i === 0) {
                this.msnry = new Masonry(this.masonryContainerElement, {
                    itemSelector: '.brick',
                    transitionDuration: '0.4s'
                });
            } else {
                this.msnry.appended(document.getElementById(`/api/upload/${photo.fileId}.jpg`));
                this.msnry.layout();
            }

            this.photos.push(photo);
            this.pswpPhotos.push(photoToPSWP(photo, this.photos.length - 1));
        };

        $rootScope.$on('$stateChangeStart', () => {
            if(this.msnry) {
                this.msnry.destroy();
            }
            addPhoto = _.noop;
        });

        $http.get('/api/gallery/' + $stateParams.galleryId)
            .then(({data: gallery}) => {
                this.gallery = gallery;
                $rootScope.title += ' | ' + gallery.name;

                if(this.gallery.photos.length < 1) {
                    this.noPhotos = true;
                    return;
                }
                let i = 0;

                $http.get(`api/photos/${gallery.photos[0]}`)
                    .then(({data}) => addPhoto(data, i++))
                    .then(() => {
                        let promises = _(gallery.photos)
                            .drop(1)
                            .map(photo => $http.get(`api/photos/${photo}`))
                            .value();

                        let daemon = new MiniDaemon(this, () => {
                            promises.pop().then(res => addPhoto(res.data, i++));
                        }, 50, promises.length);
                        daemon.start();
                    });
            })
            .catch(res => {
                this.errors.push(res);
            });
    }

    onThumbnailsClick(index) {
        this.openPhotoSwipe(index);
    }

    parseThumbnailElements(thumbElements) {
        return _(thumbElements)
            .filter(el => el.nodeType === 1 && el.localName === 'div' && el.className !== 'grid-sizer')
            .map(el => {
                let childElements = el.children[0].children;
                let size = el.getAttribute('data-size').split('x');

                return {
                    src: el.getAttribute('id'),
                    w: parseInt(size[0], 10),
                    h: parseInt(size[1], 10),
                    el, // save link to element for getThumbBoundsFn
                    msrc: childElements.length > 0 ? childElements[0].getAttribute('src') : undefined, // thumbnail url
                    title: childElements.length > 1 ? childElements[1].innerHTML : undefined    // caption (contents of figure)
                };
            })
            .value();
    }

    openPhotoSwipe(index, disableAnimation) {
        let pswpElement = document.querySelectorAll('.pswp')[0];
        let vscroll = document.body.scrollTop;

        if(!this.items || this.items.length === 0) {
            this.items = this.parseThumbnailElements(this.masonryContainerElement.childNodes);
        }

        let gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, this.items, {
            index,
            getThumbBoundsFn: i => {
                // See Options->getThumbBoundsFn section of docs for more info
                let thumbnail = this.items[i].el.children[0];
                let pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
                let rect = thumbnail.getBoundingClientRect();
                return {x: rect.left, y: rect.top + pageYScroll, w: rect.width};
            },
            hideAnimationDuration: disableAnimation ? 0 : 300,
            showAnimationDuration: disableAnimation ? 0 : 300
        });
        gallery.init();
        gallery.listen('destroy', function() {
            // Temporary workaround for PhotoSwipe scroll-to-top on close bug
            setTimeout(function() {
                window.scrollTo(null, vscroll);
            }, 5);
        });
    }
}
