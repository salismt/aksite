'use strict';

export default function Preloader() {
    return {
        template: require('./preloader.html'),
        restrict: 'E',
        link(/*scope, element, attrs*/) {}
    };
}
