'use strict';

describe('Controller: PostEditorController', function() {

    var PostEditorController,
        scope,
        sandbox,
        $http,
        $state,
        $stateParams,
        $sce,
        Upload,
        Auth;

    beforeEach(() => {
        angular.mock.module('aksiteApp');

        sandbox = sinon.sandbox.create();

        inject(function(_$controller_, _$rootScope_, _$http_, _$state_, _$stateParams_, _$sce_, _Upload_, _Auth_) {
            scope = _$rootScope_.$new();
            $http = _$http_;
            $state = _$state_;
            $stateParams = _$stateParams_;
            $sce = _$sce_;
            Upload = _Upload_;
            Auth = _Auth_;
            PostEditorController = _$controller_('PostEditorController', {
                $scope: scope,
                $http: _$http_,
                $state: _$state_,
                $stateParams: _$stateParams_,
                $sce: _$sce_,
                Upload: _Upload_,
                Auth: _Auth_
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
