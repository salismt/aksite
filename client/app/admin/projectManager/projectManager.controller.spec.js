'use strict';

describe('Controller: ProjectmanagerCtrl', function() {

    // load the controller's module
    beforeEach(module('aksiteApp'));

    var ProjectmanagerCtrl, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        ProjectmanagerCtrl = $controller('ProjectmanagerCtrl', {
            $scope: scope
        });
    }));

    it('should ...', function() {
        expect(1).toEqual(1);
    });
});
