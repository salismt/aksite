'use strict';

export default class UserController {
    /*@ngInject*/
    constructor($stateParams, User) {
        this.id = $stateParams.id;

        this.user = User.get({id: this.id});
    }
}
