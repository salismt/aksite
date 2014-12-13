'use strict';

angular.module('aksiteApp')
    .controller('GalleryCtrl', function($scope, $stateParams, $http, $q) {
        $scope.galleryId = $stateParams.galleryId;
        $scope.errors = [];
        $scope.photos = [];
        var galleryElement = document.querySelectorAll('.gallery-grid')[0];

        //TODO: make photos load asynchronously
        $http.get('/api/gallery/'+$stateParams.galleryId)
            .success(function(gallery) {
                $scope.gallery = gallery;

                if($scope.gallery.photos.length < 1) return $scope.noPhotos = true;

                $scope.pswpPhotos = [];

                _.each(gallery.photos, function(photo) {
                    $http.get('api/photos/'+photo)
                        .success(function(photo) {
                            photo.done = true;
                            photo.index = $scope.photos.length;
                            $scope.photos.push(photo);
                            $scope.pswpPhotos.push(photoToPSWP(photo, $scope.photos.length-1));
                        });
                });
                console.log($scope.photos);
                console.log($scope.pswpPhotos);
            })
            .error(function(data, status) {
                $scope.errors.push(status);
            });

        $scope.onThumbnailsClick = function(event, index) {
            //console.log(event.target);
            openPhotoSwipe(index);
        };

        var items = [];

        var openPhotoSwipe = function(index, disableAnimation) {
            //console.log(index);
            var pswpElement = document.querySelectorAll('.pswp')[0],
                gallery,
                options;

            if(!items || items.length == 0) {
                // build slides array, only once
                items = parseThumbnailElements(galleryElement);
            }

            // define options (if needed)
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

            // Pass data to PhotoSwipe and initialize it
            gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
            gallery.init();
        };

        var parseThumbnailElements = function(el) {
            var thumbElements = el.childNodes,
                numNodes = thumbElements.length,
                items = [],
                el,
                childElements,
                thumbnailEl,
                size,
                item;

            for(var i = 0; i < numNodes; i++) {
                el = thumbElements[i];

                // include only element nodes
                if(el.nodeType !== 1) {
                    continue;
                }

                childElements = el.children;
                //console.log(childElements);

                size = el.getAttribute('data-size').split('x');

                // create slide object
                item = {
                    src: el.getAttribute('id'),
                    w: parseInt(size[0], 10),
                    h: parseInt(size[1], 10)
                };

                item.el = el; // save link to element for getThumbBoundsFn

                if(childElements.length > 0) {
                    item.msrc = childElements[0].getAttribute('src'); // thumbnail url
                    if(childElements.length > 1) {
                        item.title = childElements[1].innerHTML; // caption (contents of figure)
                    }
                }

                items.push(item);
            }

            console.log(items);
            return items;
        };

        function photoToPSWP(photo, index) {
            return {
                src: 'api/upload/'+photo.fileId,
                msrc: 'api/upload/'+photo.thumbnailId,
                w: photo.width,
                h: photo.height,
                index: index
            }
        }
    });
