import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './post.routes';
import PostController from './post.controller';

//import '!raw!sass!./post.scss'

export default angular.module('aksiteApp.blog.post', [uirouter])
    .config(routing)
    .controller('PostController', PostController)
    .name;
