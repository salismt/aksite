'use strict';
import angular from 'angular';

/**
 * Removes server error when user updates input
 */
angular.module('aksiteApp')
    .directive('mongooseError', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link(scope, element, attrs, ngModel) {
                element.on('keydown', function() {
                    return ngModel.$setValidity('mongoose', true);
                });
            }
        };
    });
