'use strict';

describe('Directive: timeline', function() {

    // load the directive's module and view
    beforeEach(module('aksiteApp'));
    beforeEach(module('components/timeline/timeline.html'));

    var element, scope;

    beforeEach(inject(function($rootScope) {
        scope = $rootScope.$new();
    }));

    it('should make hidden element visible', inject(function($compile) {
        element = angular.element('<timeline></timeline>');
        element = $compile(element)(scope);
        scope.$apply();
    }));
});
