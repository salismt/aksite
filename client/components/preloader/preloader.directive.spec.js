'use strict';

describe('Directive: preloader', function() {

    var scope, element;

    beforeEach(() => {
        angular.mock.module('aksiteApp');

        inject(function(_$rootScope_) {
            scope = _$rootScope_.$new();
        });
    });

    it('should make hidden element visible', inject(function($compile) {
        element = angular.element('<preloader></preloader>');
        element = $compile(element)(scope);
        scope.$apply();
    }));
});
