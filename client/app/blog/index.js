import angular from 'angular';
import uirouter from 'angular-ui-router';

import post from './post';

import routing from './blog.routes';
import BlogController from './blog.controller';

import navbar from '../../components/navbar';

//import '!raw!sass!./blog.scss'

export default angular.module('aksiteApp.blog', [uirouter, navbar, post])
    .config(routing)
    .controller('BlogController', BlogController)
    .name;
