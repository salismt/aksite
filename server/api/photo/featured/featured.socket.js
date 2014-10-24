/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Featured = require('./featured.model.js');

exports.register = function(socket) {
  Featured.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Featured.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('featured:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('featured:remove', doc);
}
