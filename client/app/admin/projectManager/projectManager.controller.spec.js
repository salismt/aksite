'use strict';

describe('Controller: ProjectManagerController', function() {

    var ProjectManagerController,
        scope,
        sandbox,
        $http;

    beforeEach(() => {
        angular.mock.module('aksiteApp');

        sandbox = sinon.sandbox.create();

        inject(function(_$controller_, _$rootScope_, _$http_) {
            scope = _$rootScope_.$new();
            $http = _$http_;
            ProjectManagerController = _$controller_('ProjectManagerController', {
                $scope: scope,
                $http: _$http_
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
