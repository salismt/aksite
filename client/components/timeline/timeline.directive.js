'use strict';

angular.module('aksiteApp')
    .directive('timeline', function() {
        return {
            scope: {
                items: '='
            },
            templateUrl: 'components/timeline/timeline.html',
            restrict: 'EA',
            link: function(scope/*, element, attrs*/) {
                let openedCard = null;

                scope.toggleCardOpen = function(card) {
                    if(openedCard === card) {  // Clicked card is the open one, close it
                        openedCard = null;
                        card.open = false;
                    } else if(openedCard) {     // Another card is open, close it and open this one
                        openedCard.open = false;
                        card.open = true;
                        openedCard = card;
                    } else {                    // No open cards, open this one
                        card.open = true;
                        openedCard = card;
                    }
                };
            }
        };
    });
