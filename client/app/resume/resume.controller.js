'use strict';

angular.module('aksiteApp')
    .controller('ResumeCtrl', function($scope, $http) {
        $http.get('/assets/linkedin_profile.json')
            .success(function(data) {
                console.log(data);
                $scope.profile = data;

                $scope.items = [{
                    date: new Date(),
                    dateLine1: moment(new Date()).format('MMM Do'),
                    dateLine2: moment(new Date()).format('YYYY'),
                    image: 'assets/images/portrait_2014.jpg',
                    heading: 'Heading',
                    content: 'Drumstick tenderloin hamburger swine tail. Cow porchetta hamburger, tongue ground round ball tip sausage corned beef pork chop beef spare ribs bresaola. Jowl tail pancetta pork landjaeger. Sausage chicken andouille meatball, ham hock doner short ribs. Picanha turducken porchetta pork belly boudin hamburger. Jowl beef ribs tenderloin, shankle short ribs ribeye hamburger porchetta andouille chicken ground round cow ball tip. Salami ground round cow, rump hamburger chuck pork loin landjaeger short loin doner alcatra ball tip.'
                }];
            })
            .error(function(err) {
                console.log(err);
            });
    });
