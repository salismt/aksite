'use strict';

angular.module('aksiteApp')
    .directive('timeline', function() {
        return {
            scope: {
                items: '='
            },
            templateUrl: 'components/timeline/timeline.html',
            restrict: 'EA',
            link: function(/*scope, element, attrs*/) {}
        };
    });
