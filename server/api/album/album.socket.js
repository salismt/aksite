/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Album = require('./album.model');

exports.register = function(socket) {
  Album.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Album.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('album:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('album:remove', doc);
}