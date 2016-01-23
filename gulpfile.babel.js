'use strict';

import _ from 'lodash';
import del from 'del';
import gulp from 'gulp';
import path from 'path';
import gulpLoadPlugins from 'gulp-load-plugins';
import http from 'http';
import open from 'open';
import lazypipe from 'lazypipe';
import nodemon from 'nodemon';
import {Server as KarmaServer} from 'karma';
import runSequence from 'run-sequence';
import {protractor, webdriver_update} from 'gulp-protractor';
import {Instrumenter} from 'isparta';
import webpack from 'webpack-stream';
import makeWebpackConfig from './webpack.make';

var plugins = gulpLoadPlugins();
var config;
let webpackDevConfig = makeWebpackConfig({ DEV: true });

const clientPath = 'client';
const serverPath = 'server';
const paths = {
    client: {
        appPath: 'client',
        scripts: [
            `${clientPath}/**/!(*.spec|*.mock).js`
        ],
        styles: [`${clientPath}/{app,components}/**/*.scss`],
        mainStyle: `${clientPath}/app/app.scss`,
        views: `${clientPath}/{app,components}/**/*.html`,
        mainView: `${clientPath}/index.html`,
        test: [`${clientPath}/{app,components}/**/*.{spec,mock}.js`],
        assets: {
            all: 'client/assets/**/*',
            fonts: 'client/assets/fonts/**/*',
            images: 'client/assets/images/**/*',
            revManifest: `dist/${clientPath}/assets/rev-manifest.json`
        }
    },
    server: {
        scripts: [`${serverPath}/**/!(*.spec|*.integration).js`],
        json: [`${serverPath}/**/*.json`],
        test: {
            integration: [`${serverPath}/**/*.integration.js`, 'mocha.global.js'],
            unit: [`${serverPath}/**/*.spec.js`, 'mocha.global.js']
        }
    },
    e2e: ['e2e/**/*.spec.js'],
    views: {
        main: 'client/index.html',
        files: ['client/{app,components}/**/*.html']
    },
    karma: 'karma.conf.js',
    dist: 'dist',
    temp: '.tmp'
};

/********************
 * Helper functions
 ********************/

function onServerLog(log) {
    console.log(plugins.util.colors.white('[') +
        plugins.util.colors.yellow('nodemon') +
        plugins.util.colors.white('] ') +
        log.message);
}

function checkAppReady(cb) {
    var options = {
        host: 'localhost',
        port: config.port
    };
    http
        .get(options, () => cb(true))
        .on('error', () => cb(false));
}

// Call page until first success
function whenServerReady(cb) {
    var serverReady = false;
    var appReadyInterval = setInterval(() =>
        checkAppReady((ready) => {
            if(!ready || serverReady) {
                return;
            }
            clearInterval(appReadyInterval);
            serverReady = true;
            cb();
        }),
        100);
}

/********************
 * Reusable pipelines
 ********************/

let lintClientScripts = lazypipe()
    .pipe(plugins.jshint, `${clientPath}/.jshintrc`)
    .pipe(plugins.jshint.reporter, 'jshint-stylish');

let lintServerScripts = lazypipe()
    .pipe(plugins.jshint, `${serverPath}/.jshintrc`)
    .pipe(plugins.jshint.reporter, 'jshint-stylish');

let lintServerTestScripts = lazypipe()
    .pipe(plugins.jshint, `${serverPath}/.jshintrc-spec`)
    .pipe(plugins.jshint.reporter, 'jshint-stylish');

let styles = lazypipe()
    .pipe(plugins.sourcemaps.init)
    .pipe(plugins.sass)
    .pipe(plugins.autoprefixer, {browsers: ['last 1 version']})
    .pipe(plugins.sourcemaps.write, '.');

let transpileServer = lazypipe()
    .pipe(plugins.sourcemaps.init)
    .pipe(plugins.babel, {
        optional: ['runtime']
    })
    .pipe(plugins.sourcemaps.write, '.');

let transpileClient = lazypipe()
    .pipe(plugins.sourcemaps.init)
    .pipe(plugins.babel, {
        ignore: paths.client.assets.all,
        optional: ['es7.classProperties']
    })
    .pipe(plugins.sourcemaps.write, '.');

let mocha = lazypipe()
    .pipe(plugins.mocha, {
        reporter: 'spec',
        timeout: 5000,
        require: [
            './mocha.conf'
        ]
    });

let istanbul = lazypipe()
    .pipe(plugins.istanbul.writeReports, {
        dir: './coverage',
        reporters: ['json', 'html'],
        reporterOpts: {
            json: { dir: '.', file: 'server-coverage.json' },
            html: { dir: 'server' }
        }
    })
    .pipe(plugins.istanbulEnforcer, {
        thresholds: {
            global: {
                lines: 80,
                statements: 80,
                branches: 80,
                functions: 80
            }
        },
        coverageDirectory: './coverage',
        rootDirectory : ''
    });

/********************
 * Env
 ********************/

gulp.task('env:all', () => {
    let localConfig;
    try {
        localConfig = require('./server/config/local.env');
    } catch(e) {
        localConfig = {};
    }
    plugins.env({
        vars: localConfig
    });
});
gulp.task('env:test', () => {
    plugins.env({
        vars: {NODE_ENV: 'test'}
    });
});
gulp.task('env:prod', () => {
    plugins.env({
        vars: {NODE_ENV: 'production'}
    });
});

/********************
 * Tasks
 ********************/

gulp.task('styles', () => {
    return gulp.src(paths.client.mainStyle)
        .pipe(styles())
        .pipe(gulp.dest('.tmp/app'));
});

gulp.task('transpile:client', () => {
    return gulp.src(paths.client.scripts)
        .pipe(transpileClient())
        .pipe(gulp.dest('.tmp'));
});

gulp.task('transpile:server', () => {
    return gulp.src(_.union(paths.server.scripts, paths.server.json))
        .pipe(transpileServer())
        .pipe(gulp.dest(`${paths.dist}/${serverPath}`));
});

gulp.task('webpack:dev', function() {
    return gulp.src(webpackDevConfig.entry.app)
        .pipe(plugins.plumber())
        .pipe(webpack(webpackDevConfig))
        .pipe(gulp.dest(paths.temp))
        .pipe(plugins.livereload());
});

gulp.task('webpack:dist', function() {
    let webpackDistConfig = makeWebpackConfig({ BUILD: true });
    return gulp.src(webpackDistConfig.entry.app)
        .pipe(webpack(webpackDistConfig))
        .pipe(gulp.dest(paths.dist + '/client'));
});

gulp.task('lint:scripts', cb => runSequence(['lint:scripts:client', 'lint:scripts:server'], cb));

gulp.task('lint:scripts:client', () => {
    gulp.src(_.union(paths.client.scripts, _.map(paths.client.test, blob => '!' + blob), ['!client/assets/**/*']))
        .pipe(lintClientScripts());
});

gulp.task('lint:scripts:server', () => {
    gulp.src(_.union(paths.server.scripts, ['!' + paths.server.unit, '!' + paths.server.integration]))
        .pipe(lintServerScripts());
});

gulp.task('lint:scripts:clientTest', () => {
    return gulp.src(paths.client.test)
        .pipe(lintClientScripts());
});

gulp.task('lint:scripts:serverTest', () => {
    return gulp.src(_.union(paths.server.test.unit, paths.server.test.integration))
        .pipe(lintServerTestScripts());
});

gulp.task('jscs', () => {
    return gulp.src(_.union(paths.client.scripts, paths.server.scripts))
        .pipe(plugins.jscs())
        .pipe(plugins.jscs.reporter());
});

gulp.task('clean:tmp', () => del(['.tmp/**/*'], {dot: true}));

gulp.task('start:client', cb => {
    whenServerReady(() => {
        open('http://localhost:' + config.port);
        cb();
    });
});

gulp.task('start:server:prod', () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'production';
    config = require(`./${paths.dist}/${serverPath}/config/environment`);
    nodemon(`-w ${paths.dist}/${serverPath} ${paths.dist}/${serverPath}`)
        .on('log', onServerLog);
});

gulp.task('start:server', () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';
    config = require(`./${serverPath}/config/environment`);
    nodemon(`-w ${serverPath} ${serverPath}`)
        .on('log', onServerLog);
});

gulp.task('watch', () => {
    plugins.livereload.listen();

    gulp.watch('client/**/!(*.spec|*.mock).{html,js,scss}', ['webpack:dev']);

    plugins.watch(paths.server.scripts)
        .pipe(plugins.plumber())
        .pipe(lintServerScripts());

    plugins.watch(_.union(paths.server.test.unit, paths.server.test.integration)])
        .pipe(plugins.plumber())
        .pipe(lintServerTestScripts());
});

gulp.task('serve', cb => {
    runSequence([
            'clean:tmp',
            'lint:scripts',
            'env:all',
            'copy:fonts:dev'
        ],
        'webpack:dev',
        ['start:server', 'start:client'],
        'watch',
        cb);
});

gulp.task('serve:dist', cb => {
    runSequence(
        'build',
        'env:all',
        'env:prod',
        ['start:server:prod', 'start:client'],
        cb);
});

gulp.task('test', cb => {
    return runSequence('test:server', 'test:client', function() {
        cb(arguments['0']);
        process.exit(arguments['0']);
    });
});

gulp.task('test:server', cb => {
    runSequence(
        'env:all',
        'env:test',
        'mocha:unit',
        //'mocha:integration',
        'mocha:coverage',
        cb);
});

gulp.task('mocha:unit', () => {
    return gulp.src(paths.server.test.unit)
        .pipe(mocha());
});

gulp.task('mocha:integration', () => {
    return gulp.src(paths.server.test.integration)
        .pipe(mocha());
});

gulp.task('test:client', (done) => {
    new KarmaServer({
        configFile: `${__dirname}/${paths.karma}`,
        singleRun: true
    }, function(code) {
        if(code === 1) {
            plugins.util.log('Unit Test failures, exiting process');
            done('Unit Test Failures');
            process.exit(1);
        } else {
            plugins.util.log('Unit Tests passed');
            done();
        }
    }).start();
});

gulp.task('coverage:pre', () => {
    return gulp.src(paths.server.scripts)
        // Covering files
        .pipe(plugins.istanbul({
            instrumenter: Instrumenter, // Use the isparta instrumenter (code coverage for ES6)
            includeUntested: true
        }))
        // Force `require` to return covered files
        .pipe(plugins.istanbul.hookRequire());
});

gulp.task('coverage:unit', cb => {
    return gulp.src(paths.server.test.unit)
        .pipe(mocha())
        .pipe(istanbul());
    // Creating the reports after tests ran
});

gulp.task('coverage:integration', cb => {
    return gulp.src(paths.server.test.integration)
        .pipe(mocha())
        .pipe(istanbul());
    // Creating the reports after tests ran
});

gulp.task('mocha:coverage', cb => {
    runSequence('coverage:pre',
        'env:all',
        'env:test',
        'coverage:unit',
        'coverage:integration',
        cb);
});

// Downloads the selenium webdriver
gulp.task('webdriver_update', webdriver_update);

gulp.task('test:e2e', ['env:all', 'env:test', 'start:server', 'webdriver_update'], cb => {
    gulp.src(paths.client.e2e)
        .pipe(protractor({
            configFile: 'protractor.conf.js',
        })).on('error', err => {
        console.log(err)
    }).on('end', () => {
        process.exit();
    });
});

/********************
 * Build
 ********************/

gulp.task('build', cb => {
    runSequence(
        [
            'clean:dist',
            'clean:tmp'
        ],
        'build:images',
        [
            'copy:extras',
            'copy:assets',
            'copy:fonts:dist',
            'copy:server',
            'webpack:dist'
        ],
        'revReplaceWebpack',
        cb);
});

gulp.task('clean:dist', () => del([`${paths.dist}/!(.git*|.openshift|Procfile)**`], {dot: true}));

gulp.task('build:images', () => {
    return gulp.src(paths.client.assets.images)
        .pipe(plugins.cache(plugins.imagemin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        })))
        .pipe(plugins.rev())
        .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets/images`))
        .pipe(plugins.rev.manifest(paths.client.assets.revManifest, {
            base: `${paths.dist}/${clientPath}/assets`,
            merge: true
        }))
        .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets`));
});

gulp.task('revReplaceWebpack', () => {
    return gulp.src('dist/client/app.*.js')
        .pipe(plugins.revReplace({manifest: gulp.src(paths.client.assets.revManifest)}))
        .pipe(gulp.dest('dist/client'));
});

gulp.task('copy:extras', () => {
    gulp.src([
        'client/favicon.ico',
        'client/robots.txt'
    ], { dot: true })
        .pipe(gulp.dest(`${paths.dist}/${clientPath}`));
});

gulp.task('copy:assets', () => {
    return gulp.src([paths.client.assets.all, '!' + paths.client.assets.images])
        .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets`));
});

gulp.task('copy:fonts:bootstrap:dev', () => {
    gulp.src('node_modules/bootstrap/fonts/*')
        .pipe(gulp.dest('client/assets/fonts/bootstrap'));
});
gulp.task('copy:fonts:fontAwesome:dev', () => {
    gulp.src('node_modules/font-awesome/fonts/*')
        .pipe(gulp.dest('client/assets/fonts/font-awesome'));
});
gulp.task('copy:fonts:dev', cb => {
    return runSequence(['copy:fonts:bootstrap:dev', 'copy:fonts:fontAwesome:dev'], cb);
});

gulp.task('copy:fonts:bootstrap:dist', () => {
    gulp.src('node_modules/bootstrap/fonts/*')
        .pipe(gulp.dest(paths.dist + '/client/assets/fonts/bootstrap'));
});
gulp.task('copy:fonts:fontAwesome:dist', () => {
    gulp.src('node_modules/font-awesome/fonts/*')
        .pipe(gulp.dest(paths.dist + '/client/assets/fonts/font-awesome'));
});
gulp.task('copy:fonts:dist', cb => {
    return runSequence(['copy:fonts:bootstrap:dist', 'copy:fonts:fontAwesome:dist'], cb);
});

gulp.task('copy:server', () => {
    gulp.src([
        'package.json',
        'server/**/*'
    ], {cwdbase: true})
        .pipe(gulp.dest(paths.dist));
});
