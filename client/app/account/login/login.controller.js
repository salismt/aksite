'use strict';

export default class LoginController {
    user = {};
    errors = {};
    submitted = false;

    constructor(Auth, $location, $window) {
        this.Auth = Auth;
        this.$location = $location;
        this.$window = $window;
    }

    login() {
        this.submitted = true;

        this.Auth.login({
            email: this.user.email,
            password: this.user.password
        })
            .then(() => {
                // Logged in, redirect to home
                this.$location.path('/');
            })
            .catch(err => {
                this.errors.other = err.message;
            });
    };

    loginOauth(provider) {
        this.$window.location.href = '/auth/' + provider;
    };
}
