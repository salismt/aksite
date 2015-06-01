'use strict';

angular.module('aksiteApp')
    .directive('preloader', function() {
        return {
            templateUrl: 'components/preloader/preloader.html',
            restrict: 'E',
            link: function(scope, element, attrs) {
            }
        };
    });
