'use strict';

describe('Controller: ProjectCtrl', function () {

    // load the controller's module
    beforeEach(() => angular.mock.module('aksiteApp'));

    var ProjectCtrl, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        ProjectCtrl = $controller('ProjectCtrl', {
            $scope: scope
        });
    }));

    it('should ...', function () {
        expect(1).to.equal(1);
    });
});
