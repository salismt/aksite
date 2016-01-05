'use strict';

describe('Controller: PostController', function() {

    var PostController,
        sandbox,
        $rootScope,
        $stateParams,
        $http,
        $sce;

    beforeEach(() => {
        angular.mock.module('aksiteApp');

        sandbox = sinon.sandbox.create();

        inject(function(_$controller_, _$rootScope_, _$stateParams_, _$http_, _$sce_) {
            $rootScope = _$rootScope_;
            $stateParams = _$stateParams_;
            $http = _$http_;
            $sce = _$sce_;
            PostController = _$controller_('PostController', {
                $rootScope: _$rootScope_,
                $stateParams,
                $http,
                $sce
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
