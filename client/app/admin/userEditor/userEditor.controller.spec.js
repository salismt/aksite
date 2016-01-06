'use strict';

describe('Controller: UserEditorController', function() {

    var UserEditorController,
        scope,
        sandbox,
        $http,
        $state,
        $stateParams,
        $sanitize,
        Upload,
        Auth;

    beforeEach(() => {
        angular.mock.module('aksiteApp');

        sandbox = sinon.sandbox.create();

        inject(function(_$controller_, _$rootScope_, _$http_, _$state_, _$stateParams_, _$sanitize_, _Upload_, _Auth_) {
            scope = _$rootScope_.$new();
            $http = _$http_;
            $state = _$state_;
            $stateParams = _$stateParams_;
            $sanitize = _$sanitize_;
            Upload = _Upload_;
            Auth = _Auth_;
            UserEditorController = _$controller_('UserEditorController', {
                $scope: scope,
                $http: _$http_,
                $state: _$state_,
                $stateParams: _$stateParams_,
                $sanitize: _$sanitize_,
                Upload: _Upload_,
                Auth: _Auth_
            });
        });
    });

    it('should ...', function() {
        expect(1).to.equal(1);
    });
});
