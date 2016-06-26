import angular from 'angular';
import {Component} from '@angular/core';
import {upgradeAdapter} from '../../app/upgrade_adapter';

@Component({
    selector: 'preloader',
    template: require('./preloader.html')
})
export class PreloaderComponent {}

export default angular.module('directives.preloader', [])
    .directive('preloader', upgradeAdapter.downgradeNg2Component(PreloaderComponent))
    .name;
