'use strict';

describe('Controller: FilemanagerCtrl', function() {

    // load the controller's module
    beforeEach(module('aksiteApp'));

    var FilemanagerCtrl, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        FilemanagerCtrl = $controller('FileManagerController', {
            $scope: scope
        });
    }));

    it('should ...', function() {
        expect(1).to.equal(1);
    });
});
