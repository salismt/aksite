'use strict';

export default class ResumeController {
    isOpen = false;
    links = [{
        name: 'Cover Letter',
        sref: 'resume.cover'
    }, {
        name: 'Skills',
        sref: 'resume.main'
    }, {
        name: 'Experience',
        sref: 'resume.main'
    }];

    /*@ngInject*/
    constructor($mdMedia) {
        this.isOpen = $mdMedia('gt-sm');
    }
}
