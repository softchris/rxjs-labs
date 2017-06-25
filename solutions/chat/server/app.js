var express = require('express');
var app = express();
var http = require('http').Server(app);
//io
var io = require('socket.io')(http);

io.on('connection', (socket) => {
    socket.on('add-message', (message) => {
        io.emit('message', {
            type : 'new-message',
            text : message.text,
            from : message.from
        });
    })
});

http.listen(5000, () => {
    console.log('started at port 5000');
})