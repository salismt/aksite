'use strict';

describe('Controller: GalleryManagerController', function() {

    var GalleryManagerController,
        scope,
        sandbox,
        $http,
        $state;

    beforeEach(() => {
        angular.mock.module('aksiteApp');

        sandbox = sinon.sandbox.create();

        inject(function(_$controller_, _$rootScope_, _$http_, _$state_) {
            scope = _$rootScope_.$new();
            $http = _$http_;
            $state = _$state_;
            GalleryManagerController = _$controller_('GalleryManagerController', {
                $scope: scope,
                $http: _$http_,
                $state: _$state_
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
