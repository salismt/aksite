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
const MongoStore = connectMongo(session);

export default function(app) {
    var env = app.get('env');

    app.set('views', `${config.root}/server/views`);
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
    // app.use(session({
    //     secret: config.secrets.session,
    //     resave: true,
    //     saveUninitialized: true,
    //     store: new MongoStore({
    //         mongooseConnection: mongoose.connection,
    //         db: 'aksite'
    //     })
    // }));

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

    if(env === 'production') {
        app.use(favicon(path.join(config.root, 'client', 'favicon.ico')));
        app.use(express.static(path.join(config.root, 'client')));
        app.set('appPath', `${config.root}/client`);
        app.use(morgan('combined'));
    }

    if(env === 'development') {
        const webpackDevMiddleware = require('webpack-dev-middleware');
        const webpack = require('webpack');
        const makeWebpackConfig = require('../../webpack.make');
        const webpackConfig = makeWebpackConfig({ DEV: true });
        const compiler = webpack(webpackConfig);

        const pkgConfig = require('../../package.json');
        const livereloadServer = require('tiny-lr')();
        var livereloadServerConfig = {
            port: (pkgConfig.livereload || {}).port
        };
        var triggerLiveReloadChanges = function() {
            livereloadServer.changed({
                body: {
                    files: [webpackConfig.output.path + webpackConfig.output.filename]
                }
            });
        };
        if(livereloadServerConfig.port) {
            livereloadServer.listen(livereloadServerConfig.port, triggerLiveReloadChanges);
        } else {
            /**
             * Get free port for livereload
             * server
             */
            livereloadServerConfig.port = require('http').createServer().listen(function() {
                /*eslint no-invalid-this:0*/
                this.close();
                livereloadServer.listen(livereloadServerConfig.port, triggerLiveReloadChanges);
            }).address().port;
        }

        /**
         * On change compilation of bundle
         * trigger livereload change event
         */
        compiler.plugin('done', triggerLiveReloadChanges);

        app.use(webpackDevMiddleware(compiler, {
            stats: {
                colors: true,
                timings: true,
                chunks: false
            }
        }));

        app.use(require('connect-livereload')(livereloadServerConfig));
    }

    if(env === 'development' || env === 'test') {
        app.use(express.static(path.join(config.root, '.tmp')));
        app.use(express.static(app.get('appPath')));
        app.use(morgan('dev'));
        app.use(errorHandler()); // Error handler - has to be last
    }
}
