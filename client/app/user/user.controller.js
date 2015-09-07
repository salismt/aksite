'use strict';

class UserController {
    constructor($scope, $stateParams, User) {
        this.id = $stateParams.id;

        this.user = User.get({id: this.id});
    }
}

angular.module('aksiteApp')
    .controller('UserController', UserController);
