'use strict';
import {
    wrapperLodash as _,
    sample,
    mixin,
    shuffle,
    remove,
    partial,
    isEqual
} from 'lodash-es';
mixin(_, {
    sample,
    shuffle,
    remove,
    partial,
    isEqual
});

import 'jquery';
import 'jquery-bridget';
import 'desandro-get-style-property/get-style-property';
import 'get-size/get-size';
import 'wolfy87-eventemitter/EventEmitter';
import 'eventie/eventie';
import 'doc-ready/doc-ready';
import 'desandro-matches-selector/matches-selector';
import 'fizzy-ui-utils/utils';
import 'outlayer/item';
import 'outlayer/outlayer';
import Masonry from 'masonry-layout';
import 'imagesloaded/imagesloaded';

import MiniDaemon from '../../components/minidaemon';

import classie from 'classie';

let texts = ['dashed-stroke-text', 'gradient-text', 'pattern-text', 'diag-striped-text', 'bg-img-text'];
let usedTexts = [];
let currentText = _.sample(texts);  // Load first random text
let vendorImages = [{
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
    href: 'https://webpack.github.io',
    src: 'assets/images/webpack.png',
    alt: 'webpack'
}, {
    href: 'http://mochajs.org/',
    src: 'assets/images/mocha.png',
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
    href: 'https://opbeat.com',
    src: 'assets/images/opbeat.png',
    alt: 'opbeat'
}, {
    href: 'https://codeship.com/',
    src: 'assets/images/codeship.png',
    alt: 'codeship'
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
}, {
    href: 'https://www.npmjs.com/',
    src: 'assets/images/npm.svg',
    alt: 'npm'
}, {
    wide: true,
    href: 'http://github.com/',
    src: 'assets/images/github.png',
    alt: 'github'
}];

export default class MainController {
    /*@ngInject*/
    constructor($rootScope) {
        vendorImages = _.shuffle(vendorImages);
        classie.removeClass(document.getElementById(currentText), 'hidden');
        usedTexts.push(_.remove(texts, _.partial(_.isEqual, currentText)));

        var masonryContainerElement = document.getElementById('masonry-container');
        var msnry;

        let addPhoto = function(photo, i) {
            let div = document.createElement('div');
            div.setAttribute('class', `masonry-brick${photo.wide ? ' w2' : ''}`);
            div.setAttribute('id', photo.src);

            let a = document.createElement('a');
            a.setAttribute('href', photo.href);
            a.setAttribute('style', 'width: inherit;');

            let img = document.createElement('img');
            img.setAttribute('src', photo.src);
            img.setAttribute('style', 'width: inherit;');
            img.setAttribute('alt', '');

            a.appendChild(img);
            div.appendChild(a);

            document.getElementById('masonry-container').appendChild(div);

            if(i === 0) {
                msnry = new Masonry(masonryContainerElement, {
                    itemSelector: '.masonry-brick',
                    transitionDuration: '0.4s',
                    gutter: 20,
                    containerStyle: {
                        margin: 'auto',
                        'margin-bottom': '100px'
                    },
                    isFitWidth: true
                });
            } else {
                msnry.appended(div);
                msnry.layout();
            }
        };

        $rootScope.$on('$stateChangeStart', () => {
            if(msnry) {
                msnry.destroy();
            }
            addPhoto = function() {};
        });

        let i = 0;
        let daemon = new MiniDaemon(this, () => {
            addPhoto(vendorImages[i], i++);
        }, 50, vendorImages.length);
        daemon.start();
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
