'use strict';

describe('Controller: GalleryController', function() {

    var GalleryController,
        sandbox,
        $rootScope,
        scope,
        $stateParams,
        $http;

    beforeEach(() => {
        angular.mock.module('aksiteApp');

        sandbox = sinon.sandbox.create();

        inject(function(_$controller_, _$rootScope_, _$stateParams_, _$http_) {
            $rootScope = _$rootScope_;
            scope = _$rootScope_.$new();
            $stateParams = _$stateParams_;
            $http = _$http_;
            GalleryController = _$controller_('GalleryController', {
                $rootScope: _$rootScope_,
                $scope: scope,
                $stateParams,
                $http
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
