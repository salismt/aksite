'use strict';

export default function Preloader() {
    return {
        template: require('./preloader.html'),
        restrict: 'E',
        link: function(/*scope, element, attrs*/) {}
    };
}
