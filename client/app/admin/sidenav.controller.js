'use strict';

export default class LeftController {
    /*@ngInject*/
    constructor($mdSidenav) {
        this.$mdSidenav = $mdSidenav;
    }

    close() {
        this.$mdSidenav('left').close()
            .then(function() {
                //$log.debug("close LEFT is done");
            });
    };
}
