'use strict';

describe('Controller: DashboardController', function() {

    var DashboardCtrl,
        scope,
        sandbox,
        $http,
        $timeout;

    beforeEach(() => {

        angular.mock.module('aksiteApp');

        sandbox = sinon.sandbox.create();

        inject(function(_$controller_, _$rootScope_, _$http_, _$timeout_) {
            scope = _$rootScope_.$new();
            $http = _$http_;
            $timeout = _$timeout_;
            DashboardCtrl = _$controller_('DashboardController', {
                $scope: scope,
                $http: _$http_,
                $timeout: _$timeout_
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
