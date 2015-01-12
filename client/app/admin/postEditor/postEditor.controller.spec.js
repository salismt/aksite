'use strict';

describe('Controller: PostEditorCtrl', function() {

    // load the controller's module
    beforeEach(module('aksiteApp'));

    var PosteditorCtrl, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        PosteditorCtrl = $controller('PosteditorCtrl', {
            $scope: scope
        });
    }));

    it('should ...', function() {
        expect(1).toEqual(1);
    });
});
