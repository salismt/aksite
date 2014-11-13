'use strict';

describe('Controller: MainCtrl', function() {

    // load the controller's module
    beforeEach(module('aksiteApp'));
    beforeEach(module('socketMock'));


    var MainCtrl,
        scope,
        $httpBackend;

    // Initialize the controller and a mock scope
    beforeEach(inject(function(_$httpBackend_, $controller, $rootScope) {
        var items = [],
            testItem = {
                "type": "photo",
                "link": "#",
                "thumbnailId": "test0Thumb",
                "name": "test0",
                "_id": "test0Id"
            };
        for(var i=0; i<100; i++) { items.push(testItem); }
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('/api/things')
            .respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);
        $httpBackend.expectGET('/api/featured')
            .respond({
                _id: 'id0',
                fileId: 'fileId0',
                items: items
            });

        scope = $rootScope.$new();
        MainCtrl = $controller('MainCtrl', {
            $scope: scope
        });

        // We don't want the D3 section initializer trying to access the DOM
        // TODO: make this spec test loadFeatured instead of just skipping it
        spyOn(scope, 'loadFeatured');
    }));

    it('should attach a list of things to the scope', function() {
        $httpBackend.flush();
        expect(scope.awesomeThings.length).toBe(4);
    });
});
