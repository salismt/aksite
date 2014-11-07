'use strict';

describe('Controller: FeaturedmanagerCtrl', function() {

    // load the controller's module
    beforeEach(module('aksiteApp'));

    var FeaturedmanagerCtrl, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        FeaturedmanagerCtrl = $controller('FeaturedmanagerCtrl', {
            $scope: scope
        });
    }));

    it('should ...', function() {
        expect(1).toEqual(1);
    });
});
