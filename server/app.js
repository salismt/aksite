/**
 * Main application file
 */
'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development'; // eslint-disable-line no-process-env

import express from 'express';
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');
import config from './config/environment';
import Grid from 'gridfs-stream';

if(config.env === 'production') {
    require('opbeat').start({
        organizationId: config.opbeat.orgId,
        appId: config.opbeat.appId,
        secretToken: config.opbeat.secret
    });
}

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
    console.error(`MongoDB connection error: ${err}`);
    process.exit(-1); // eslint-disable-line no-process-exit
});

// Setup server
var app = express();
var server = require('http').createServer(app);
var socketio = require('socket.io').listen(server);
require('./config/socketio').default(socketio);
require('./config/express').default(app);
require('./routes').default(app);

// Start server
function startServer() {
    app.angularFullstack = server.listen(config.port, config.ip, function() {
        console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
    });
}

setImmediate(function() {
    Grid.mongo = mongoose.mongo;
    var conn = mongoose.createConnection(config.mongo.uri);

    conn.once('open', function(err) {
        if(err) {
            throw err;
        }

        // Populate DB with sample data
        if(config.seedDB) {
            // wait for DB seed
            require('./config/seed').default()
                .then(startServer);
        } else {
            startServer();
        }
    });
});

// Expose app
export default app;
