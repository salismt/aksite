'use strict';
import _ from 'lodash-es';
import {noop} from 'lodash-es';
import angular from 'angular';
import ngCookies from 'angular-cookies';

import _User from './user.service';

/**
 * Return a callback or noop function
 *
 * @param  {Function|*} cb - a 'potential' function
 * @return {Function}
 */
function safeCb(cb) {
    return _.isFunction(cb) ? cb : noop;
}

/*@ngInject*/
class Auth {
    currentUser = {};

    constructor($http, User, $cookies) {
        this.$http = $http;
        this.User = User;
        this.$cookies = $cookies;

        if($cookies.get('token')) {
            this.currentUser = User.get();
        }
    }

    /**
     * Authenticate user and save token
     *
     * @param  {Object}   user     - login info
     * @param  {Function} callback - optional, function(error, user)
     * @return {Promise}
     */
    login({email, password}, callback) {
        return this.$http.post('/auth/local', {
            email,
            password
        }).then(res => {
            this.$cookies.put('token', res.data.token);
            this.currentUser = this.User.get();
            console.log(this.currentUser);
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
        this.$cookies.remove('token');
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
        return this.User.save(user,
            data => {
                this.$cookies.put('token', data.token);
                this.currentUser = this.User.get();
                return safeCb(callback)(null, user);
            },
            err => {
                this.logout();
                return safeCb(callback)(err);
            }).$promise;
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
        return this.User.changePassword({ id: this.currentUser._id }, {
            oldPassword,
            newPassword
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
     * @param  {Function|*} [callback] - optional, function(user)
     * @return {Object|Promise}
     */
    getCurrentUser(callback) {
        if(!callback) {
            return this.currentUser;
        }

        var promise = this.currentUser.hasOwnProperty('$promise')
            ? this.currentUser.$promise
            : Promise.resolve(this.currentUser);
        return promise
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
     * @param  {Function|*} [callback] - optional, function(is)
     * @return {Boolean|Promise}
     */
    isLoggedIn(callback) {
        if(!callback) {
            return this.currentUser.hasOwnProperty('role');
        }

        return this.getCurrentUser(null)
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
            return cb(true);
        } else {
            return cb(false);
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
        if(arguments.length === 0) {
            return this.currentUser.role === 'admin';
        }

        return this.getCurrentUser().then(function(user) {
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
        return this.$cookies.get('token');
    }
}

export default angular.module('services.Auth', [_User, ngCookies])
    .service('Auth', Auth)
    .name;
