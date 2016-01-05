'use strict';

describe('Controller: ProjectsCtrl', function() {

    // load the controller's module
    beforeEach(() => angular.mock.module('aksiteApp'));

    var ProjectsCtrl, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        ProjectsCtrl = $controller('ProjectsCtrl', {
            $scope: scope
        });
    }));

    it('should ...', function() {
        expect(1).to.equal(1);
    });
});
