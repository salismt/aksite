'use strict';

angular.module('aksiteApp')
    .controller('GalleryCtrl', function($rootScope, $scope, $stateParams, $http) {
        $scope.galleryId = $stateParams.galleryId;
        $scope.errors = [];
        $scope.photos = [];
        $scope.pswpPhotos = [];
        var galleryElement = document.getElementById('masonry-container');
        var items = [];

        $http.get('/api/gallery/' + $stateParams.galleryId)
            .success(function(gallery) {
                $scope.gallery = gallery;
                $rootScope.title += ' | ' + gallery.name;

                if($scope.gallery.photos.length < 1) {
                    $scope.noPhotos = true;
                    return;
                }

                _.each(gallery.photos, function(photo) {
                    $http.get('api/photos/'+photo)
                        .success(function(photo) {
                            photo.index = $scope.photos.length;
                            $scope.photos.push(photo);
                            $scope.pswpPhotos.push(photoToPSWP(photo, $scope.photos.length-1));
                        });
                });
            })
            .error(function(data, status) {
                $scope.errors.push(status);
            });

        $scope.onThumbnailsClick = function(index) {
            openPhotoSwipe(index);
        };

        var openPhotoSwipe = function(index, disableAnimation) {
            var pswpElement = document.querySelectorAll('.pswp')[0],
                gallery,
                options,
                vscroll = document.body.scrollTop;

            if(!items || items.length == 0) {
                items = parseThumbnailElements(galleryElement);
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
    });
