'use strict';

export default class {
    users = [];

    /*@ngInject*/
    constructor(User, $state, $mdDialog, $mdToast) {
        this.$state = $state;
        this.$mdDialog = $mdDialog;
        this.$mdToast = $mdToast;
        this.User = User;

        this.users = User.query();
    }

    goToUser(id) {
        this.$state.go('userEditor', {userId: id});
    }

    deleteUser(user, ev) {
        this.$mdDialog.show(this.$mdDialog.confirm()
            .title('Are you sure you would like to delete this user?')
            .ariaLabel('Delete User?')
            .ok('Delete')
            .cancel('Cancel')
            .targetEvent(ev))
            .then(() => {
                this.User.remove({id: user._id}).$promise
                    .then(() => {
                        this.users.splice(this.$index, 1);
                    })
                    .catch(() => {
                        this.$mdToast.show(
                            this.$mdToast.simple()
                                .textContent('Deleting user failed')
                                .position('bottom right')
                                .hideDelay(10000)
                        );
                    });
            });
    }
}
