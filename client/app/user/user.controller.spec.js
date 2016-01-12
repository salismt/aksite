'use strict';

describe('Controller: UserController', function() {

    var UserController,
        sandbox,
        $stateParams,
        User;

    beforeEach(() => {
        angular.mock.module('aksiteApp');

        sandbox = sinon.sandbox.create();

        inject(function(_$controller_, _$stateParams_, _User_) {
            $stateParams = _$stateParams_;
            User = _User_;
            UserController = _$controller_('UserController', {
                $stateParams: _$stateParams_,
                User: _User_
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
