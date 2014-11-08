/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var FeaturedItem = require('./featuredItem.model.js');

exports.register = function(socket) {
    FeaturedItem.schema.post('save', function(doc) {
        onSave(socket, doc);
    });
    FeaturedItem.schema.post('remove', function(doc) {
        onRemove(socket, doc);
    });
}

function onSave(socket, doc, cb) {
    socket.emit('featured:save', doc);
}

function onRemove(socket, doc, cb) {
    socket.emit('featured:remove', doc);
}
