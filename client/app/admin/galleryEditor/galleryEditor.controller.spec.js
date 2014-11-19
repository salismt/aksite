'use strict';

describe('Controller: GalleryEditorCtrl', function() {

    // load the controller's module
    beforeEach(module('aksiteApp'));

    var GalleryeditorCtrl, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        GalleryeditorCtrl = $controller('GalleryeditorCtrl', {
            $scope: scope
        });
    }));

    it('should ...', function() {
        expect(1).toEqual(1);
    });
});
