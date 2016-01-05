'use strict';

describe('Controller: SettingsDashboardController', function() {

    var SettingsDashboardController,
        scope,
        sandbox,
        Auth,
        $mdToast;

    beforeEach(() => {
        angular.mock.module('aksiteApp');

        sandbox = sinon.sandbox.create();

        inject(function(_$controller_, _$rootScope_, _Auth_, _$mdToast_) {
            scope = _$rootScope_.$new();
            Auth = _Auth_;
            $mdToast = _$mdToast_;
            SettingsDashboardController = _$controller_('SettingsDashboardController', {
                $scope: scope
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
