'use strict';

angular.module('aksiteApp')
    .directive('timeline', function() {
        return {
            scope: {

            },
            templateUrl: 'components/timeline/timeline.html',
            restrict: 'EA',
            controller: function($scope) {
                $scope.items = [{
                    date: new Date(),
                    dateLine1: moment(new Date()).format('MMM Do'),
                    dateLine2: moment(new Date()).format('YYYY'),
                    image: null,
                    heading: 'Heading',
                    content: 'Drumstick tenderloin hamburger swine tail. Cow porchetta hamburger, tongue ground round ball tip sausage corned beef pork chop beef spare ribs bresaola. Jowl tail pancetta pork landjaeger. Sausage chicken andouille meatball, ham hock doner short ribs. Picanha turducken porchetta pork belly boudin hamburger. Jowl beef ribs tenderloin, shankle short ribs ribeye hamburger porchetta andouille chicken ground round cow ball tip. Salami ground round cow, rump hamburger chuck pork loin landjaeger short loin doner alcatra ball tip.'
                }];
            },
            link: function(/*scope, element, attrs*/) {}
        };
    });
