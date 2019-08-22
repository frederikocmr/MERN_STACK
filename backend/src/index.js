const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');

const httpServer = express();
const server = require('http').Server(httpServer);
const webSocket = require('socket.io')(server);

const connectedUsers = {};

webSocket.on('connection', socket => {
    const { user } = socket.handshake.query;
    connectedUsers[user] = socket.id;
});

const uri = '';
mongoose.connect(uri, { useNewUrlParser: true });

// middleware
httpServer.use((req, res, next) => {
    req.webSocket = webSocket;
    req.connectedUsers = connectedUsers;

    return next();
})

httpServer.use(cors());
httpServer.use(express.json());
httpServer.use(routes);

server.listen(3333);

