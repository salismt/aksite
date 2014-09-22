'use strict';

angular.module('aksiteApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('photos', {
        url: '/photos',
        templateUrl: 'app/photos/photos.html',
        controller: 'PhotosCtrl'
      });
  });