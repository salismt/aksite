'use strict';

import _ from 'lodash';
import angular from 'angular';
import ngCookies from 'angular-cookies';

/**
 * Return a callback or noop function
 *
 * @param  {Function|*} cb - a 'potential' function
 * @return {Function}
 */
function safeCb(cb) {
    return _.isFunction(cb) ? cb : _.noop;
}

class Auth {
    constructor($http, User) {
        this.$http = $http;
        this.currentUser = {};
        if(ngCookies.get('token')) {
            this.this.currentUser = User.get();
        }
    }

    /**
     * Authenticate user and save token
     *
     * @param  {Object}   user     - login info
     * @param  {Function} callback - optional, function(error, user)
     * @return {Promise}
     */
    login(user, callback) {
        return this.$http.post('/auth/local', {
            email: user.email,
            password: user.password
        }).then(res => {
            ngCookies.put('token', res.data.token);
            this.currentUser = User.get();
            return this.currentUser.$promise;
        }).then(user => {
            safeCb(callback)(null, user);
            return user;
        }).catch(err => {
            this.logout();
            safeCb(callback)(err.data);
            return Promise.reject(err.data);
        });
    }

    /**
     * Delete access token and user info
     */
    logout() {
        ngCookies.remove('token');
        this.currentUser = {};
    }

    /**
     * Create a new user
     *
     * @param  {Object}   user     - user info
     * @param  {Function} callback - optional, function(error, user)
     * @return {Promise}
     */
    createUser(user, callback) {
        return User.save(user,
            function(data) {
                ngCookies.put('token', data.token);
                this.currentUser = User.get();
                return safeCb(callback)(null, user);
            },
            function(err) {
                this.logout();
                return safeCb(callback)(err);
            }.bind(this)).$promise;
    }

    /**
     * Change password
     *
     * @param  {String}   oldPassword
     * @param  {String}   newPassword
     * @param  {Function} callback    - optional, function(error, user)
     * @return {Promise}
     */
    changePassword(oldPassword, newPassword, callback) {
        return User.changePassword({ id: this.currentUser._id }, {
            oldPassword: oldPassword,
            newPassword: newPassword
        }, function() {
            return safeCb(callback)(null);
        }, function(err) {
            return safeCb(callback)(err);
        }).$promise;
    }

    /**
     * Gets all available info on a user
     *   (synchronous|asynchronous)
     *
     * @param  {Function|*} callback - optional, funciton(user)
     * @return {Object|Promise}
     */
    getCurrentUser(callback) {
        if (arguments.length === 0) {
            return this.currentUser;
        }

        var value = (this.currentUser.hasOwnProperty('$promise')) ? this.currentUser.$promise : this.currentUser;
        return $q.when(value)
            .then(function(user) {
                safeCb(callback)(user);
                return user;
            }, function() {
                safeCb(callback)({});
                return {};
            });
    }

    /**
     * Check if a user is logged in
     *   (synchronous|asynchronous)
     *
     * @param  {Function|*} callback - optional, function(is)
     * @return {Boolean|Promise}
     */
    isLoggedIn(callback) {
        if (arguments.length === 0) {
            return this.currentUser.hasOwnProperty('role');
        }

        return this.getthis.currentUser(null)
            .then(function(user) {
                var is = user.hasOwnProperty('role');
                safeCb(callback)(is);
                return is;
            });
    }

    /**
     * Waits for this.currentUser to resolve before checking if user is logged in
     */
    isLoggedInAsync(cb) {
        if(this.currentUser.hasOwnProperty('$promise')) {
            this.currentUser.$promise.then(function() {
                cb(true);
            }).catch(function() {
                cb(false);
            });
        } else if(this.currentUser.hasOwnProperty('role')) {
            cb(true);
        } else {
            cb(false);
        }
    }

    /**
     * Check if a user is an admin
     *   (synchronous|asynchronous)
     *
     * @param  {Function|*} callback - optional, function(is)
     * @return {Boolean|Promise}
     */
    isAdmin(callback) {
        if (arguments.length === 0) {
            return this.currentUser.role === 'admin';
        }

        return this.getthis.currentUser(null)
            .then(function(user) {
                var is = user.role === 'admin';
                safeCb(callback)(is);
                return is;
            });
    }

    /**
     * Get auth token
     *
     * @return {String} - a token string used for authenticating
     */
    getToken() {
        return ngCookies.get('token');
    }
}

export default angular.module('services.auth', [])
    .service('auth', Auth)
    .name;
