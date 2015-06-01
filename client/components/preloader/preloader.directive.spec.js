'use strict';

describe('Directive: preloader', function() {

    // load the directive's module and view
    beforeEach(module('aksiteApp'));
    beforeEach(module('components/preloader/preloader.html'));

    var element, scope;

    beforeEach(inject(function($rootScope) {
        scope = $rootScope.$new();
    }));

    it('should make hidden element visible', inject(function($compile) {
        element = angular.element('<preloader></preloader>');
        element = $compile(element)(scope);
        scope.$apply();
        expect(element.text()).toBe('this is the preloader directive');
    }));
});
