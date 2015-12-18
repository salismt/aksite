// Generated on 2015-08-11 using generator-angular-fullstack 2.1.1
'use strict';

import _ from 'lodash';
import gulp from 'gulp';
import path from 'path';
import gulpLoadPlugins from 'gulp-load-plugins';
import http from 'http';
import lazypipe from 'lazypipe';
import {stream as wiredep} from 'wiredep';
import nodemon from 'nodemon';
import runSequence from 'run-sequence';

var plugins = gulpLoadPlugins();
var config;

const paths = {
    appPath: require('./bower.json').appPath || 'client',
    client: {
        scripts: [
            'client/**/*.js',
            '!client/bower_components/**/*.js'
        ],
        styles: ['client/{app,components}/**/*.scss'],
        mainStyle: 'client/app/app.scss',
        test: ['client/**/*.{spec,mock}.js'],
        testRequire: [
            'client/bower_components/angular/angular.js',
            'client/bower_components/angular-mocks/angular-mocks.js',
            'client/bower_components/angular-resource/angular-resource.js',
            'client/bower_components/angular-cookies/angular-cookies.js',
            'client/bower_components/angular-sanitize/angular-sanitize.js',
            'client/bower_components/angular-route/angular-route.js',
            'client/**/*.spec.js'
        ],
        bower: 'client/bower_components/',
        assets: {
            all: 'client/assets/**/*',
            fonts: 'client/assets/fonts/**/*',
            images: 'client/assets/images/**/*'
        }
    },
    server: {
        scripts: ['server/**/*.js'],
        test: ['server/**/*.{spec,mock,integration}.js']
    },
    views: {
        main: 'client/index.html',
        files: ['client/{app,components}/**/*.html']
    },
    karma: 'karma.conf.js',
    dist: 'dist'
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
    http
        .get({
            host: 'localhost',
            port: config.port
        }, () => cb(true))
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
    .pipe(plugins.jshint, 'client/.jshintrc')
    .pipe(plugins.jshint.reporter, 'jshint-stylish');

let lintServerScripts = lazypipe()
    .pipe(plugins.jshint, 'server/.jshintrc')
    .pipe(plugins.jshint.reporter, 'jshint-stylish');

let styles = lazypipe()
    .pipe(plugins.sourcemaps.init)
    .pipe(plugins.sass)
    .pipe(plugins.autoprefixer, {browsers: ['last 1 version']})
    .pipe(plugins.sourcemaps.write, '.');

let transpile = lazypipe()
    .pipe(plugins.sourcemaps.init)
    .pipe(plugins.babel, {
        ignore: paths.client.assets.all,
        optional: [
            'es7.classProperties'
        ]
    })
    .pipe(plugins.sourcemaps.write, '.');

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

gulp.task('inject', cb => {
    runSequence(['inject:js', 'inject:css', 'inject:scss'], cb);
});

gulp.task('inject:js', () => {
    return gulp.src(paths.views.main)
        .pipe(plugins.inject(
            gulp.src(_.union(paths.client.scripts, ['!client/**/*.spec.js'], ['!client/app/app.js']), {read: false})
                .pipe(plugins.sort())
            , {
                starttag: '<!-- injector:js -->',
                endtag: '<!-- endinjector -->',
                transform: (filepath) => '<script src="' + filepath.replace('/client/', '') + '"></script>'
            }))
        .pipe(gulp.dest('client'));
});

gulp.task('inject:css', () => {
    return gulp.src(paths.views.main)
        .pipe(plugins.inject(
            gulp.src('/client/**/*.css', {read: false})
                .pipe(plugins.sort())
            , {
                starttag: '<!-- injector:css -->',
                endtag: '<!-- endinjector -->',
                transform: (filepath) => '<link rel="stylesheet" href="' + filepath.replace('/client/', '').replace('/.tmp/', '') + '">'
            }))
        .pipe(gulp.dest('client'));
});

gulp.task('inject:scss', () => {
    return gulp.src('client/app/app.scss')
        .pipe(plugins.inject(
            gulp.src(_.union(paths.client.styles, ['!' + paths.client.mainStyle]), {read: false})
                .pipe(plugins.sort())
            , {
                starttag: '// injector',
                endtag: '// endinjector',
                transform: (filepath) => {
                    return '@import \'' +
                        filepath
                            .replace('/client/app/', '')
                            .replace('/client/components/', '../components/')
                            .replace(/_(.*).scss/, (match, p1, offset, string) => p1)
                            .replace('.scss', '') +
                        '\';';
                }
            }))
        .pipe(gulp.dest('client/app'));
});

gulp.task('styles', () => {
    return gulp.src(paths.client.mainStyle)
        .pipe(styles())
        .pipe(gulp.dest('.tmp/app'));
});

gulp.task('transpile', () => {
    return gulp.src(paths.client.scripts)
        .pipe(transpile())
        .pipe(gulp.dest('.tmp'));
});

gulp.task('lint:scripts', cb => runSequence(['lint:scripts:client', 'lint:scripts:server'], cb));

gulp.task('lint:scripts:client', () => {
    gulp.src(_.union(paths.client.scripts, _.map(paths.client.test, blob => '!' + blob), ['!client/assets/**/*']))
        .pipe(lintClientScripts());
});

gulp.task('lint:scripts:server', () => {
    gulp.src(_.union(paths.server.scripts, _.map(paths.server.test, blob => '!' + blob)))
        .pipe(lintServerScripts());
});

gulp.task('clean:tmp', () => {
    return gulp.src('.tmp', {read: false})
        .pipe(plugins.clean())
});

gulp.task('start:client', cb => {
    whenServerReady(() => {
        gulp.src(paths.views.main)
            .pipe(plugins.open({uri: 'http://localhost:' + config.port}));
        cb();
    });
});

gulp.task('start:server', () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';
    config = require('./server/config/environment');
    nodemon('--watch server server')
        .on('log', onServerLog);
});

gulp.task('watch', () => {
    var testFiles = _.union(paths.client.test, paths.server.test);

    plugins.livereload.listen();

    plugins.watch(paths.client.styles, () => {
        gulp.src(paths.client.mainStyle)
            .pipe(plugins.plumber())
            .pipe(styles())
            .pipe(gulp.dest('.tmp/app'))
            .pipe(plugins.livereload());
    });

    plugins.watch(paths.views.files)
        .pipe(plugins.plumber())
        .pipe(plugins.livereload());

    plugins.watch(paths.client.scripts, ['inject:js'])
        .pipe(plugins.plumber())
        .pipe(transpile())
        .pipe(gulp.dest('.tmp'))
        .pipe(plugins.livereload());

    plugins.watch(_.union(paths.server.scripts, testFiles))
        .pipe(plugins.plumber())
        .pipe(lintServerScripts())
        .pipe(plugins.livereload());

    gulp.watch('bower.json', ['wiredep:client']);
});

gulp.task('serve', cb => {
    runSequence(['clean:tmp', 'lint:scripts', 'inject', 'wiredep:client', 'env:all'],
        ['transpile', 'styles'],
        ['start:server', 'start:client'],
        'watch',
        cb);
});

gulp.task('test', cb => {
    process.env.NODE_ENV = 'test';
    runSequence('test:server', 'test:client', cb);
});

gulp.task('test:server', cb => {
    runSequence(
        'env:all',
        'env:test',
        'mocha:unit',
        //'mocha:coverage',
        cb);
});

gulp.task('test:client', () => {
    return gulp.src(paths.client.test)
        .pipe(plugins.karma({
            configFile: paths.karma,
            action: 'run'
        }))
        .on('error', function(err) {
            // Make sure failed tests cause gulp to exit non-zero
            throw err;
        });
});

gulp.task('mocha:unit', () => {
    return gulp.src(paths.server.test)
        .pipe(plugins.mocha({
            reporter: 'spec',
            require: [
                './mocha.conf'
            ]
        }))
        .once('end', function () {
            process.exit();
        });
});

gulp.task('test:e2e', () => {});

gulp.task('test:coverage', () => {});

// inject bower components
gulp.task('wiredep:client', () => {
    gulp.src(paths.views.main)
        .pipe(wiredep({
            exclude: [
                /bootstrap-sass-official/,
                /bootstrap.js/,
                '/json3/',
                '/es5-shim/',
                /bootstrap.css/,
                /font-awesome.css/
            ],
            ignorePath: paths.appPath
        }))
        .pipe(gulp.dest('client/'));
});

gulp.task('wiredep:test', () => {
    gulp.src(paths.karma)
        .pipe(wiredep({
            exclude: [
                /bootstrap-sass-official/,
                /bootstrap.js/,
                '/json3/',
                '/es5-shim/',
                /bootstrap.css/,
                /font-awesome.css/
            ],
            devDependencies: true
        }))
        .pipe(gulp.dest('./'));
});

/********************
 * Build
 ********************/

//FIXME: looks like font-awesome isn't getting loaded
gulp.task('build', cb => {
    runSequence(
        ['clean:dist', 'inject', 'wiredep:client'],
        [
            'build:images',
            'copy:extras',
            'copy:assets',
            'copy:server',
            'build:client'
        ],
        cb);
});

gulp.task('clean:dist', () => gulp.src('dist', {read: false}).pipe(plugins.clean()));

gulp.task('build:client', ['transpile', 'styles', 'html'], () => {
    var appFilter = plugins.filter('**/app.js');
    var jsFilter = plugins.filter('**/*.js');
    var cssFilter = plugins.filter('**/*.css');
    var htmlFilter = plugins.filter('**/*.html');

    let assets = plugins.useref.assets({searchPath: ['client', '.tmp']});

    return gulp.src(paths.views.main)
        .pipe(assets)
            .pipe(appFilter)
                .pipe(plugins.addSrc.append('.tmp/templates.js'))
                .pipe(plugins.concat('app\\app.js'))
            .pipe(appFilter.restore())
            .pipe(jsFilter)
                .pipe(plugins.ngmin())
                .pipe(plugins.uglify())
            .pipe(jsFilter.restore())
            .pipe(cssFilter)
                .pipe(plugins.minifyCss({cache: true}))
            .pipe(cssFilter.restore())
            .pipe(plugins.rev())
        .pipe(assets.restore())
        .pipe(plugins.revReplace())
        .pipe(plugins.useref())
        .pipe(gulp.dest(paths.dist + '/public'));
});

gulp.task('html', function () {
    return gulp.src('client/{app,components}/**/*.html')
        .pipe(plugins.angularTemplatecache({
            module: 'testApp'
        }))
        .pipe(gulp.dest('.tmp'));
});

gulp.task('build:images', () => {
    gulp.src(paths.client.assets.images)
        .pipe(plugins.cache(plugins.imagemin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest(paths.dist + '/public/assets/images'));
});

gulp.task('copy:extras', () => {
    gulp.src([
        'client/favicon.ico',
        'client/robots.txt'
    ], { dot: true })
        .pipe(gulp.dest(paths.dist + '/public'));
});

gulp.task('copy:assets', () => {
    gulp.src([paths.client.assets.all, '!' + paths.client.assets.images])
        .pipe(gulp.dest(paths.dist + '/fonts'));
});

gulp.task('copy:server', () => {
    gulp.src([
        'package.json',
        'bower.json',
        '.bowerrc',
        'server/**/*'
    ], {cwdbase: true})
        .pipe(gulp.dest(paths.dist));
});
