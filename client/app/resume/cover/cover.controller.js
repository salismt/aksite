'use strict';

const text = `
Bacon ipsum dolor amet andouille kevin frankfurter sausage ham hock ground round. Meatloaf ball tip capicola sausage meatball jowl. Capicola andouille picanha, leberkas short ribs bresaola kielbasa. Biltong shankle landjaeger pancetta beef corned beef tail. Andouille filet mignon hamburger bresaola venison. Pork loin short loin shank, tongue swine strip steak capicola picanha drumstick doner hamburger venison rump.

Porchetta alcatra strip steak kielbasa prosciutto. Tri-tip jowl pork chop kielbasa, picanha brisket kevin flank cow filet mignon short ribs ham drumstick pastrami salami. Ham hamburger spare ribs brisket short loin. Short ribs sirloin cupim pancetta brisket beef ribs tri-tip alcatra ball tip fatback jerky ham chuck prosciutto pork belly.

Sausage hamburger pork loin, chuck doner pork belly capicola beef shoulder shank turducken biltong turkey. Strip steak short loin sausage chicken. Prosciutto beef filet mignon doner pig bacon. Beef ribs pork loin filet mignon jowl, meatloaf venison tongue picanha prosciutto shank jerky hamburger bacon. Cupim sirloin pork belly meatball, ribeye turkey pancetta picanha shank ball tip beef ribs brisket biltong cow.

Beef ribs chicken ground round tail pancetta pork, drumstick fatback ribeye capicola beef cow hamburger sirloin. Turducken capicola short ribs ham hock cupim, landjaeger tail pork loin brisket kevin pig ball tip shoulder tri-tip pork. Pork chop ham hock salami short ribs frankfurter, picanha tri-tip hamburger venison. Jowl spare ribs frankfurter ribeye, bresaola beef shank leberkas landjaeger pork loin turkey pig. Tri-tip ribeye corned beef, kevin ball tip shankle tenderloin beef filet mignon rump.

Shankle tri-tip prosciutto pork loin, flank ground round t-bone turkey short ribs tail tongue. Cow ground round kevin capicola landjaeger. Cow landjaeger capicola venison bacon cupim. Tenderloin ribeye hamburger, short loin pork chop turkey ham hock salami capicola tail porchetta.`;

export default class ResumeController {
    text = text;
    
    /*@ngInject*/
    constructor($scope) {
        this.$scope = $scope;
    }

    openSidenav() {
        this.$scope.$parent.vm.isOpen = true;
    }
}
