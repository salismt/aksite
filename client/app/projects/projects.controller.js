'use strict';
import angular from 'angular';

import 'jquery';
import 'jquery-bridget';
import 'desandro-get-style-property/get-style-property';
import 'get-size/get-size';
import 'wolfy87-eventemitter/EventEmitter';
import 'eventie/eventie';
import 'doc-ready/doc-ready';
import 'desandro-matches-selector/matches-selector';
import 'fizzy-ui-utils/utils';
import 'outlayer/item';
import 'outlayer/outlayer';
import Masonry from 'masonry-layout';
import 'imagesloaded/imagesloaded';

import MiniDaemon from '../../components/minidaemon';

export default class ProjectsController {
    loadingProjects = true;
    msnry;

    /*@ngInject*/
    constructor(Project, $rootScope, $scope, $http, $compile, $state) {
        this.masonryContainerElement = document.getElementById('masonry-container');
        this.$state = $state;

        let addProject = (project, i) => {
            let container = angular.element(`<a class="brick card md-whiteframe-z1" ng-click="vm.goToProject('${project._id}')"></a>`);
            container.attr('id', project._id);
            container = $compile(container)($scope);

            let item = angular.element('<div class="item"></div>');
            let img = angular.element(`<img src="/api/upload/${project.thumbnailId}.jpg" alt="">`);
            item.append(img);
            container.append(item);

            let cardContent = angular.element('<div class="card-content"></div>');
            let title = angular.element(`<h2 class="md-title">${project.name}</h2>`);
            let description = angular.element(`<p>${project.info}</p>`);
            cardContent.append(title);
            cardContent.append(description);
            container.append(cardContent);

            angular.element(this.masonryContainerElement).append(container);

            if(i === 0) {
                this.msnry = new Masonry(this.masonryContainerElement, {
                    itemSelector: '.brick',
                    transitionDuration: '0.4s',
                    gutter: 20
                });
            } else {
                this.msnry.appended(document.getElementById(project._id));
                this.msnry.layout();
            }
        };

        $rootScope.$on('$stateChangeStart', () => {
            if(this.msnry) {
                this.msnry.destroy();
            }
            addProject = function() {};
        });

        Project.query().$promise
            .then(projects => {
                this.loadingProjects = false;
                Reflect.deleteProperty(projects, '$promise');
                Reflect.deleteProperty(projects, '$resolved');
                this.projects = projects;

                let i = 0;
                let daemon = new MiniDaemon(this, () => {
                    addProject(this.projects[i], i++);
                }, 50, this.projects.length);
                daemon.start();
            })
            .catch(res => {
                this.errors.push(res);
            });
    }

    goToProject(id) {
        this.$state.go('project', {projectId: id});
    }
}
