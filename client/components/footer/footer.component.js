import angular from 'angular';
import {Component} from 'angular2/core';
import {upgradeAdapter} from '../../app/upgrade_adapter';

@Component({
    selector: 'footer',
    template: require('./footer.html'),
    styles: [require('./footer.scss')]
})
export class FooterComponent {}

export default angular.module('directives.footer', [])
    .directive('footer', upgradeAdapter.downgradeNg2Component(FooterComponent))
    .name;
