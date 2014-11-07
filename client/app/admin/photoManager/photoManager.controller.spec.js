'use strict';

describe('Controller: PhotomanagerCtrl', function() {

    // load the controller's module
    beforeEach(module('aksiteApp'));

    var PhotomanagerCtrl, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        PhotomanagerCtrl = $controller('PhotomanagerCtrl', {
            $scope: scope
        });
    }));

    it('should ...', function() {
        expect(1).toEqual(1);
    });
});
