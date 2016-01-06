'use strict';

describe('Controller: ProjectEditorController', function() {

    var ProjectEditorController,
        scope,
        sandbox,
        $http,
        $state,
        $stateParams,
        $sanitize,
        Upload;

    beforeEach(() => {
        angular.mock.module('aksiteApp');

        sandbox = sinon.sandbox.create();

        inject(function(_$controller_, _$rootScope_, _$http_, _$state_, _$stateParams_, _$sanitize_, _Upload_) {
            scope = _$rootScope_.$new();
            $http = _$http_;
            $state = _$state_;
            $stateParams = _$stateParams_;
            $sanitize = _$sanitize_;
            Upload = _Upload_;
            ProjectEditorController = _$controller_('ProjectEditorController', {
                $scope: scope,
                $http: _$http_,
                $state: _$state_,
                $stateParams: _$stateParams_,
                $sanitize: _$sanitize_,
                Upload: _Upload_
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
