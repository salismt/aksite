'use strict';

import moment from 'moment';

export default class ResumeController {
    profile = {};
    jobs = [];

    /*@ngInject*/
    constructor($scope, $http) {
        this.$scope = $scope;
        this.isOpen = $scope.$parent.vm.isOpen;

        $http.get('/assets/linkedin_profile.json')
            .then(({data}) => {
                this.profile = data;

                this.jobs = [{
                    date: moment('05-19-2014', 'MM-DD-YYYY'),
                    dateLine1: moment('05-19-2014', 'MM-DD-YYYY').format('MMM YYYY'),
                    dateLine2: 'to ' + moment('12-31-2014', 'MM-DD-YYYY').format('MMM YYYY'),
                    image: 'assets/images/inin.svg',
                    heading: 'Interactive Intelligence',
                    content: 'Software Engineer. Indianapolis, IN. Front-end web application development using AngularJS/KnockoutJS for CAAS and PureCloud products.',
                    badges: [{
                        alt: 'AngularJS',
                        src: 'assets/images/angularjs.png'
                    }, {
                        alt: 'KnockoutJS',
                        src: 'assets/images/knockoutjs.png'
                    }, {
                        alt: 'LESS',
                        src: 'assets/images/less.png'
                    }]
                }, {
                    date: moment('01-25-2015', 'MM-DD-YYYY'),
                    dateLine1: moment('02-15-2015', 'MM-DD-YYYY').format('MMM YYYY'),
                    dateLine2: 'to ' + moment('04-15-2015', 'MM-DD-YYYY').format('MMM YYYY'),
                    image: 'assets/images/mimir.png',
                    heading: 'Mimir LLC',
                    content: `
Mimir LLC is a Purdue West Lafayette based startup whose main focus is classroom-based programming-learning software.
In my position at Mimir, I worked on full-stack web development contracts for the company.`,
                    badges: [{
                        alt: 'AngularJS',
                        src: 'assets/images/angularjs.png'
                    }]
                }, {
                    date: moment('05-18-2015', 'MM-DD-YYYY'),
                    dateLine1: moment('05-18-2015', 'MM-DD-YYYY').format('MMM YYYY'),
                    dateLine2: `to ${moment('02-19-2016', 'MM-DD-YYYY').format('MMM YYYY')}`,
                    image: 'assets/images/inin.svg',
                    heading: 'Interactive Intelligence',
                    content: 'Front-end web application development using KnockoutJS for PureCloud Telephony Admin.',
                    badges: [{
                        alt: 'AngularJS',
                        src: 'assets/images/angularjs.png'
                    }, {
                        alt: 'KnockoutJS',
                        src: 'assets/images/knockoutjs.png'
                    }, {
                        alt: 'Grunt',
                        src: 'assets/images/grunt.png'
                    }, {
                        alt: 'LESS',
                        src: 'assets/images/less.png'
                    }, {
                        alt: 'Node.js',
                        src: 'assets/images/nodejs_square.png'
                    }]
                }];
            })
            .catch(({data}) => {
                console.log(data);
            });
    }

    openSidenav() {
        this.$scope.$parent.vm.isOpen = true;
    }
}
