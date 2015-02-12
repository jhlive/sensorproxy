module.exports = function(server) {
  var globalSocket

  var io = require('socket.io')(server)
  var notes = io
    .of('/notes')
    .on('connection', function (socket) {
       globalSocket = socket
  })
}