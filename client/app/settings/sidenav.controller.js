'use strict';

export default class SettingsSidenavController {
    /*@ngInject*/
    constructor($mdSidenav) {
        this.close = function() {
            $mdSidenav('left').close()
                .then(function() {
                    //$log.debug("close LEFT is done");
                });
        };
    }
}
