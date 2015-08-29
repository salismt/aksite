'use strict';

angular.module('aksiteApp')
    .controller('ResumeCtrl', function($scope, $http) {
        $http.get('/assets/linkedin_profile.json')
            .success(function(data) {
                console.log(data);
                $scope.profile = data;

                $scope.items = [{
                    date: moment('05-19-2014', 'MM-DD-YYYY'),
                    dateLine1: moment('05-19-2014', 'MM-DD-YYYY').format('MMM YYYY'),
                    dateLine2: 'to ' + moment('December 31, 2014', 'MMM DD, YYYY').format('MMM YYYY'),
                    image: 'assets/images/inin.svg',
                    heading: 'Interactive Intelligence',
                    content: 'Software Engineer. Indianapolis, IN. Front-end web application development using AngularJS/KnockoutJS for Caas and PureCloud products.',
                    badges: [{
                        alt: 'AngularJS',
                        src: 'assets/images/angularjs.png'
                    }]
                }];
            })
            .error(function(err) {
                console.log(err);
            });
    });
