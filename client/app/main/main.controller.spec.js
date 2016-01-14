'use strict';

describe('Controller: MainController', function() {
    var MainController,
        sandbox,
        rootScope;

    beforeEach(() => {
        angular.mock.module('aksiteApp');

        sandbox = sinon.sandbox.create();

        inject(function(_$controller_, _$rootScope_) {
            rootScope = _$rootScope_;
            MainController = _$controller_('MainController', {
                $rootScope: _$rootScope_
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
