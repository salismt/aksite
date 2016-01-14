'use strict';

describe('Controller: GalleryEditorController', function() {

    var GalleryEditorController,
        sandbox,
        $http,
        $stateParams,
        $state,
        Upload;

    beforeEach(() => {

        angular.mock.module('aksiteApp');

        sandbox = sinon.sandbox.create();

        inject(function(_$controller_, _$http_, _$stateParams_, _$state_, _Upload_) {
            $http = _$http_;
            $stateParams = _$stateParams_;
            $state = _$state_;
            Upload = _Upload_;
            GalleryEditorController = _$controller_('GalleryEditorController', {
                $http: _$http_,
                $stateParams: _$stateParams_,
                $state: _$state_,
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
