'use strict';

describe('Controller: BlogmanagerCtrl', function() {

    // load the controller's module
    beforeEach(module('aksiteApp'));

    var BlogmanagerCtrl, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        BlogmanagerCtrl = $controller('BlogmanagerCtrl', {
            $scope: scope
        });
    }));

    it('should ...', function() {
        expect(1).toEqual(1);
    });
});
