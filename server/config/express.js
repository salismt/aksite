/**
 * Express configuration
 */

'use strict';

import express from 'express';
import favicon from 'serve-favicon';
import morgan from 'morgan';
import compression from 'compression';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import errorHandler from 'errorhandler';
import path from 'path';
import lusca from 'lusca';
import config from './environment';
import passport from 'passport';
import session from 'express-session';
import mongoose from 'mongoose';
import connectMongo from 'connect-mongo';
let MongoStore = connectMongo(session);

module.exports = function(app) {
    var env = app.get('env');

    app.set('views', config.root + '/server/views');
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.set('appPath', path.join(config.root, 'client'));
    app.use(compression());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(cookieParser());
    app.use(passport.initialize());

    // Persist sessions with mongoStore
    // We need to enable sessions for passport twitter because its an oauth 1.0 strategy
    app.use(session({
        secret: config.secrets.session,
        resave: true,
        saveUninitialized: true,
        store: new MongoStore({
            mongooseConnection: mongoose.connection,
            db: 'aksite'
        })
    }));

    /**
     * Lusca - express server security
     * https://github.com/krakenjs/lusca
     */
    app.use(lusca({
        csrf: {
            angular: true
        },
        xframe: 'SAMEORIGIN',
        hsts: {
            maxAge: 31536000, //1 year, in seconds
            includeSubDomains: true,
            preload: true
        },
        xssProtection: true
    }));

    if('production' === env) {
        app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
        app.use(express.static(path.join(config.root, 'public')));
        app.set('appPath', config.root + '/public');
        app.use(morgan('dev'));
    }

    if(env === 'development') {
        app.use(require('connect-livereload')());
    }

    if('development' === env || 'test' === env) {
        app.use(express.static(path.join(config.root, '.tmp')));
        app.use(express.static(app.get('appPath')));
        app.use(morgan('dev'));
        app.use(errorHandler()); // Error handler - has to be last
    }
};
