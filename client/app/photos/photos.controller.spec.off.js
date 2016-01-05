'use strict';

describe('Controller: PhotoController', function() {

    var PhotoController,
        scope,
        sandbox,
        $http,
        Gallery,
        $state;

    beforeEach(() => {
        angular.mock.module('aksiteApp');

        sandbox = sinon.sandbox.create();

        inject(function(_$controller_, _$rootScope_, _$http_, _Gallery_, _$state_) {
            scope = _$rootScope_.$new();
            $http = _$http_;
            Gallery = _Gallery_;
            $state = _$state_;
            PhotoController = _$controller_('PhotoController', {
                $scope: scope,
                $http: _$http_,
                //Gallery: _Gallery_,
                Gallery: {},
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
