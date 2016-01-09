'use strict';

describe('Controller: MainController', function() {
    var MainController,
        scope,
        sandbox;

    beforeEach(() => {
        angular.mock.module('aksiteApp');

        sandbox = sinon.sandbox.create();

        inject(function(_$controller_, _$rootScope_) {
            scope = _$rootScope_.$new();
            MainController = _$controller_('MainController', {
                $scope: scope
            });
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should ...', function() {
        expect(1).to.equal(1);
    });
});
