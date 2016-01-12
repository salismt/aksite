'use strict';

export default class SettingsDashboardController {
    submitted = false;
    user = {
        oldPassword: undefined,
        newPassword: undefined
    };

    /*@ngInject*/
    constructor(Auth, $mdToast, $scope) {
        this.Auth = Auth;
        this.$mdToast = $mdToast;

        // un-mark password as wrong when changed
        $scope.$watch(() => this.userForm.oldPassword.$modelValue, () => {
            this.userForm.oldPassword.$setValidity('wrongPassword', true);
        })
    }

    changePassword(form) {
        this.submitted = true;
        if(form.$valid) {
            this.Auth.changePassword(this.user.oldPassword, this.user.newPassword)
                .then(() => {
                    this.showSimpleToast('Password Updated');
                })
                .catch(() => {
                    this.userForm.oldPassword.$setValidity('wrongPassword', false);
                });
        }
    };

    showSimpleToast(text) {
        this.$mdToast.show(
            this.$mdToast.simple()
                .content(text)
                .position('bottom right')
                .hideDelay(3000)
        );
    };
}
