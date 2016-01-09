'use strict';
import _ from 'lodash';
import angular from 'angular';

import jquery from 'jquery';
import jqueryBridget from 'jquery-bridget';
import getStyleProperty from 'desandro-get-style-property/get-style-property';
import getSize from 'get-size/get-size';
import EventEmitter from 'wolfy87-eventemitter/EventEmitter';
import eventie from 'eventie/eventie';
import docReady from 'doc-ready/doc-ready';
import matchesSelector from 'desandro-matches-selector/matches-selector';
import utils from 'fizzy-ui-utils/utils';
import item from 'outlayer/item'
import outlayer from 'outlayer/outlayer';
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded/imagesloaded';

import PhotoSwipe from 'photoswipe';
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';

import MiniDaemon from '../../../components/minidaemon';

export default function GalleryController($rootScope, $scope, $stateParams, $http, $timeout, $compile) {
    'ngInject';
    $scope.galleryId = $stateParams.galleryId;
    $scope.errors = [];
    $scope.photos = [];
    $scope.pswpPhotos = [];
    var masonryContainerElement = document.getElementById('masonry-container');
    var items = [];

    var msnry;

    $http.get('/api/gallery/' + $stateParams.galleryId)
        .then(function(res) {
            let gallery = res.data;
            $scope.gallery = gallery;
            $rootScope.title += ' | ' + gallery.name;

            if($scope.gallery.photos.length < 1) {
                return $scope.noPhotos = true;
            }
            let i = 0;

            let addPhoto = function(photo, i) {
                photo.index = $scope.photos.length;

                let div = angular.element('<div></div>');
                div.attr('class', 'masonry-brick');
                div.attr('data-size', `${photo.width}x${photo.height}`);
                div.attr('id', `/api/upload/${photo.fileId}.jpg`);

                let img = angular.element('<img>');
                img.attr('src', `/api/upload/${photo.thumbnailId}.jpg`);
                img.attr('alt', '');
                img.attr('ng-click', `onThumbnailsClick(${photo.index})`);
                img = $compile(img)($scope);
                div.append(img);

                angular.element(document.getElementById('masonry-container')).append(div);

                if(i === 0) {
                    msnry = new Masonry(masonryContainerElement, {
                        itemSelector: '.masonry-brick',
                        transitionDuration: '0.4s'
                    });
                } else {
                    msnry.appended(document.getElementById(`/api/upload/${photo.fileId}.jpg`));
                    msnry.layout();
                }

                $scope.photos.push(photo);
                $scope.pswpPhotos.push(photoToPSWP(photo, $scope.photos.length-1));
            };

            $http.get('api/photos/' + gallery.photos[0])
                .then(res => addPhoto(res.data, i++))
                .then(() => {
                    let promises = [];
                    _.each(gallery.photos, function(photo, index) {
                        if(index === 0) return;
                        promises.push($http.get('api/photos/' + photo));
                    });

                    let daemon = new MiniDaemon(this, () => {
                        promises.pop().then(res => addPhoto(res.data, i++));
                    }, 50, promises.length);
                    daemon.start();
                });
        })
        .catch(function(res) {
            $scope.errors.push(res);
        });

    $scope.onThumbnailsClick = function(index) {
        openPhotoSwipe(index);
    };

    var openPhotoSwipe = function(index, disableAnimation) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            vscroll = document.body.scrollTop;

        if(!items || items.length === 0) {
            items = parseThumbnailElements(masonryContainerElement);
        }

        options = {
            index: index,
            getThumbBoundsFn: function(index) {
                // See Options->getThumbBoundsFn section of docs for more info
                var thumbnail = items[index].el.children[0],
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect();
                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            }
        };

        if(disableAnimation) {
            options.hideAnimationDuration = options.showAnimationDuration = 0;
        }

        gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
        gallery.listen('destroy', function() {
            // Temporary workaround for PhotoSwipe scroll-to-top on close bug
            setTimeout(function() {
                window.scrollTo(null, vscroll);
            }, 5);
        });
    };

    var parseThumbnailElements = function(el) {
        var thumbElements = el.childNodes,
            items = [],
            childElements,
            size,
            item;

        _.forEach(thumbElements, function(el) {
            if(el.nodeType !== 1 || el.localName !== 'div' || el.className === 'grid-sizer') {
                return;
            }

            childElements = el.children[0].children;
            size = el.getAttribute('data-size').split('x');

            // create slide object
            item = {
                src: el.getAttribute('id'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10),
                el: el// save link to element for getThumbBoundsFn
            };

            if(childElements.length > 0) {
                item.msrc = childElements[0].getAttribute('src'); // thumbnail url
                if(childElements.length > 1) {
                    item.title = childElements[1].innerHTML; // caption (contents of figure)
                }
            }

            items.push(item);
        });

        return items;
    };

    function photoToPSWP(photo, index) {
        return {
            src: 'api/upload/' + photo.fileId,
            msrc: 'api/upload/' + photo.thumbnailId,
            w: photo.width,
            h: photo.height,
            index: index
        };
    }
}
