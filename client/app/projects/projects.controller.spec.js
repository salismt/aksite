'use strict';

describe('Controller: ProjectsController', function() {

    var ProjectsController,
        scope,
        sandbox,
        Project;

    beforeEach(() => {
        angular.mock.module('aksiteApp');

        sandbox = sinon.sandbox.create();

        inject(function(_$controller_, _$rootScope_, _Project_) {
            scope = _$rootScope_.$new();
            Project = _Project_;
            ProjectsController = _$controller_('ProjectsController', {
                $scope: scope,
                Project: _Project_
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
