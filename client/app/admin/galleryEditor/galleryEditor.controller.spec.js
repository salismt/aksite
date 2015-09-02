'use strict';

describe('Controller: GalleryEditorCtrl', function() {

    // load the controller's module
    beforeEach(module('aksiteApp'));

    var GalleryeditorCtrl, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        GalleryeditorCtrl = $controller('GalleryEditorCtrl', {
            $scope: scope
        });
    }));

    it('should ...', function() {
        expect(1).to.equal(1);
    });
});
