'use strict';

describe('Controller: ProjectEditorCtrl', function() {

    // load the controller's module
    beforeEach(() => angular.mock.module('aksiteApp'));

    var ProjecteditorCtrl, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        ProjecteditorCtrl = $controller('ProjectEditorCtrl', {
            $scope: scope
        });
    }));

    it('should ...', function() {
        expect(1).to.equal(1);
    });
});
