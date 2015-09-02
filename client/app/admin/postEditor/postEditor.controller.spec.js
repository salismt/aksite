'use strict';

describe('Controller: PostEditorCtrl', function() {

    // load the controller's module
    beforeEach(module('aksiteApp'));

    var PosteditorCtrl, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        PosteditorCtrl = $controller('PostEditorCtrl', {
            $scope: scope
        });
    }));

    it('should ...', function() {
        expect(1).to.equal(1);
    });
});
