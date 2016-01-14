'use strict';
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var fs = require('fs');
var path = require('path');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var env = require('./server/config/environment');

module.exports = function makeWebpackConfig(options) {
  /**
   * Environment type
   * BUILD is for generating minified builds
   * TEST is for generating test builds
   */
  var BUILD = !!options.BUILD;
  var TEST = !!options.TEST;
  var DEV = !!options.DEV;

  /**
   * Config
   * Reference: http://webpack.github.io/docs/configuration.html
   * This is the object where all configuration gets set
   */
  var config = {};

  /**
   * Entry
   * Reference: http://webpack.github.io/docs/configuration.html#entry
   * Should be an empty object if it's generating a test build
   * Karma will set this when it's a test build
   */
  if(TEST) {
    config.entry = {}
  } else {
    config.entry = {
      app: './client/app/app.js'
    }
  }

  /**
   * Output
   * Reference: http://webpack.github.io/docs/configuration.html#output
   * Should be an empty object if it's generating a test build
   * Karma will handle setting it up for you when it's a test build
   */
  if(TEST) {
    config.output = {}
  } else {
    config.output = {
      // Absolute output directory
      path: BUILD ? __dirname + '/dist/client/' : __dirname + '/.tmp/',

      // Output path from the view of the page
      // Uses webpack-dev-server in development
      publicPath: (BUILD || DEV) ? '/' : 'http://localhost:' + 8080 + '/',
      //publicPath: BUILD ? '/' : 'http://localhost:' + env.port + '/',

      // Filename for entry points
      // Only adds hash in build mode
      filename: BUILD ? '[name].[hash].js' : '[name].bundle.js',

      // Filename for non-entry points
      // Only adds hash in build mode
      chunkFilename: BUILD ? '[name].[hash].js' : '[name].bundle.js'
    }
  }

    if(TEST) {
        config.resolve = {
            modulesDirectories: [
                'node_modules'
            ],
            extensions: ['', '.js']
        }
    }

  /**
   * Devtool
   * Reference: http://webpack.github.io/docs/configuration.html#devtool
   * Type of sourcemap to use per build type
   */
  if(TEST) {
    config.devtool = 'inline-source-map';
  } else if(BUILD || DEV) {
    config.devtool = 'source-map';
  } else {
    config.devtool = 'eval';
  }

  /**
   * Loaders
   * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
   * List: http://webpack.github.io/docs/list-of-loaders.html
   * This handles most of the magic responsible for converting modules
   */

  // Initialize module
  config.module = {
    preLoaders: [],
    loaders: [{
      // JS LOADER
      // Reference: https://github.com/babel/babel-loader
      // Transpile .js files using babel-loader
      // Compiles ES6 and ES7 into ES5 code
      test: /\.js$/,
      loader: 'babel',
      query: {
          //presets: ['es2015'],
          optional: [
              'runtime',
              'es7.classProperties',
              'es7.decorators'
          ]
      },
      exclude: /node_modules/
    }, {
      // ASSET LOADER
      // Reference: https://github.com/webpack/file-loader
      // Copy png, jpg, jpeg, gif, svg, woff, woff2, ttf, eot files to output
      // Rename the file using the asset hash
      // Pass along the updated reference to your code
      // You can add here any file extension you want to get copied to your output
      test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
      loader: 'file'
    }, {
      // HTML LOADER
      // Reference: https://github.com/webpack/raw-loader
      // Allow loading html through js
      test: /\.html$/,
      loader: 'raw'
    }, {
        // SASS LOADER
        // Reference: https://github.com/jtangelder/sass-loader
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
    }, {
        test: /(jquery|jquery-bridget|desandro-get-style-property|get-size|wolfy87-eventemitter|eventie|doc-ready|desandro-matches-selector|fizzy-ui-utils|outlayer|masonry-layout|imagesloaded|photoswipe)/,
        loader: 'imports?define=>false&this=>window'
    }]
  };

    config.sassLoader = {
        includePaths: require('bourbon').includePaths
    };

    config.module.postLoaders = [{
        test: /\.js$/,
        loader: 'ng-annotate?single_quotes'
    }];

    // ISPARTA INSTRUMENTER LOADER
    // Reference: https://github.com/ColCh/isparta-instrumenter-loader
    // Instrument JS files with Isparta for subsequent code coverage reporting
    // Skips node_modules and spec files
    // Using version 0.2.1, since 0.2.2 uses Isparta 4, which in turn uses Babel 6
    if(TEST) {
        config.module.preLoaders.push({
            //delays coverage til after tests are run, fixing transpiled source coverage error
            test: /\.js$/, exclude: /(node_modules|spec\.js|mock\.js)/, loader: 'isparta-instrumenter', query: {
                babel: {
                    optional: ['runtime', 'es7.classProperties', 'es7.decorators']
                }
            }
        });
    }

  // CSS LOADER
  // Reference: https://github.com/webpack/css-loader
  // Allow loading css through js
  //
  // Reference: https://github.com/postcss/postcss-loader
  // Postprocess your css with PostCSS plugins
  var cssLoader = {
    test: /\.css$/,
    // Reference: https://github.com/webpack/extract-text-webpack-plugin
    // Extract css files in production builds
    //
    // Reference: https://github.com/webpack/style-loader
    // Use style-loader in development for hot-loading
    loader: ExtractTextPlugin.extract('style', 'css?sourceMap!postcss')
  };

  // Skip loading css in test mode
  if(TEST) {
    // Reference: https://github.com/webpack/null-loader
    // Return an empty module
    cssLoader.loader = 'null'
  }

  // Add cssLoader to the loader list
  config.module.loaders.push(cssLoader);

  /**
   * PostCSS
   * Reference: https://github.com/postcss/autoprefixer-core
   * Add vendor prefixes to your css
   */
  config.postcss = [
    autoprefixer({
      browsers: ['last 2 version']
    })
  ];

  /**
   * Plugins
   * Reference: http://webpack.github.io/docs/configuration.html#plugins
   * List: http://webpack.github.io/docs/list-of-plugins.html
   */
  config.plugins = [
    // Reference: https://github.com/webpack/extract-text-webpack-plugin
    // Extract css files
    // Disabled when in test mode or not in build mode
    new ExtractTextPlugin('[name].[hash].css', {
      disable: !BUILD || TEST
    })
  ];

  // Skip rendering index.html in test mode
  if(!TEST && !DEV) {
    // Reference: https://github.com/ampedandwired/html-webpack-plugin
    // Render index.html
    config.plugins.push(
      new HtmlWebpackPlugin({
        templateContent: fs.readFileSync('./client/index.html').toString().replace('<script src="app.bundle.js"></script>', ''),
        inject: 'body'
      })
    )
  }

  // Add build specific plugins
  if(BUILD) {
    config.plugins.push(
      // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
      // Only emit files when there are no errors
      new webpack.NoErrorsPlugin(),

      // Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
      // Dedupe modules in the output
      new webpack.optimize.DedupePlugin(),

      // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
      // Minify all javascript, switch loaders to minimizing mode
      new webpack.optimize.UglifyJsPlugin({
          mangle: true,
          output: {
              comments: false
          },
          compress: {
              warnings: false
          }
      })
    )
  }

    if(TEST) {
        config.stats = {
            colors: true,
            reasons: true
        };
        config.debug = false;
    }

  /**
   * Dev server configuration
   * Reference: http://webpack.github.io/docs/configuration.html#devserver
   * Reference: http://webpack.github.io/docs/webpack-dev-server.html
   */
  config.devServer = {
    contentBase: './client/',
    stats: {
      modules: false,
      cached: false,
      colors: true,
      chunk: false
    }
  };

  return config;
};
