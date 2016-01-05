'use strict';

describe('Controller: MainCtrl', function() {

    // load the controller's module
    beforeEach(() => angular.mock.module('aksiteApp'));
    beforeEach(() => angular.mock.module('stateMock'));
    beforeEach(() => angular.mock.module('socketMock'));

    var MainCtrl;
    var scope;
    var state;
    var $httpBackend;

    // Initialize the controller and a mock scope
    beforeEach(inject(function(_$httpBackend_, $controller, $rootScope, $state) {
        $httpBackend = _$httpBackend_;
        //$httpBackend.expectGET('/api/things')
        //    .respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);

        scope = $rootScope.$new();
        state = $state;
        MainCtrl = $controller('MainCtrl', {
            $scope: scope
        });
    }));

    //it('should attach a list of things to the scope', function() {
    //    $httpBackend.flush();
    //    scope.awesomeThings.length.should.equal(4);
    //});
});
