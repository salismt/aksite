/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Gallery = require('./gallery.model');

export function register(socket) {
    Gallery.schema.post('save', function(doc) {
        onSave(socket, doc);
    });
    Gallery.schema.post('remove', function(doc) {
        onRemove(socket, doc);
    });
}

function onSave(socket, doc, cb) {
    socket.emit('gallery:save', doc);
}

function onRemove(socket, doc, cb) {
    socket.emit('gallery:remove', doc);
}
