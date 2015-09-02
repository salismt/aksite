'use strict';

describe('Service: Project', function () {

    // load the service's module
    beforeEach(module('aksiteApp'));

    // instantiate service
    var Project;
    beforeEach(inject(function (_Project_) {
        Project = _Project_;
    }));

    it('should do something', function () {
        expect(!!Project).to.be.true;
    });

});
