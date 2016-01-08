'use strict';

import classie from 'classie';

let texts = ['dashed-stroke-text', 'gradient-text', 'pattern-text', 'diag-striped-text', 'bg-img-text'];
let usedTexts = [];
let currentText = _.sample(texts);  // Load first random text
const vendorImages = [{
    href: 'https://angular.io/',
    src: 'assets/images/angular.png',
    alt: 'angular'
}, {
    href: 'http://d3js.org/',
    src: 'assets/images/d3.svg',
    alt: 'd3'
}, {
    href: 'https://facebook.github.io/react/',
    src: 'assets/images/react.svg',
    alt: 'react'
}, {
    href: 'https://karma-runner.github.io',
    src: 'assets/images/karma.png',
    alt: 'karma'
}, {
    href: 'https://lodash.com/',
    src: 'assets/images/lodash.png',
    alt: 'lodash'
}, {
    href: 'http://gulpjs.com/',
    src: 'assets/images/gulp.png',
    alt: 'gulp'
}, {
    href: 'https://jasmine.github.io/',
    src: 'assets/images/jasmine.svg',
    alt: 'jasmine'
}, {
    href: 'http://mochajs.org/',
    src: 'assets/images/mocha.svg',
    alt: 'mocha'
}, {
    href: 'http://sass-lang.com/',
    src: 'assets/images/sass.svg',
    alt: 'sass'
}, {
    wide: true,
    href: 'https://babeljs.io/',
    src: 'assets/images/babel.png',
    alt: 'babel'
}, {
    wide: true,
    href: 'http://bourbon.io/',
    src: 'assets/images/bourbon.png',
    alt: 'bourbon'
}, {
    wide: true,
    href: 'https://www.mongodb.org/',
    src: 'assets/images/mongodb.svg',
    alt: 'mongodb'
}, {
    wide: true,
    href: 'https://newrelic.com/',
    src: 'assets/images/newrelic.svg',
    alt: 'newrelic'
}, {
    wide: true,
    href: 'https://nodejs.org/',
    src: 'assets/images/nodejs.svg',
    alt: 'nodejs'
}, {
    wide: true,
    href: 'http://expressjs.com/',
    src: 'assets/images/express.png',
    alt: 'express'
}, {
    wide: true,
    href: 'http://socket.io/',
    src: 'assets/images/socketio.svg',
    alt: 'socketio'
}];

export default class MainController {
    /*@ngInject*/
    constructor($timeout) {
        this.vendorImages = vendorImages;
        classie.removeClass(document.getElementById(currentText), 'hidden');
        usedTexts.push(_.remove(texts, _.partial(_.isEqual, currentText)));

        $timeout(() => this.showMasonry = true);
    }

    changeText() {
        // We've used all the styles; start over, using them all again
        if(texts.length === 0) {
            texts = usedTexts;
            usedTexts = [];
        }
        // Hide the previously used text
        classie.addClass(document.getElementById(currentText), 'hidden');
        // Get the new text ID
        currentText = _.sample(texts);
        // Move the new text ID to the usedTexts array, so that it's not used again until we run out of styles
        usedTexts.push(_.remove(texts, _.partial(_.isEqual, currentText)));
        // Show the new text
        classie.removeClass(document.getElementById(currentText), 'hidden');
    }
}
