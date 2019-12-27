var socketio = require('socket.io');
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};

// is invoked in server.js
exports.listen = function(server);

    // starts SIO server on same port as httpServer
    io = socketio.listen(server);
    // reduces verbose logging
    io.set('log-level', 1);

    // defines how each user connection is handled
    io.sockets.on('connection', function(socket) {

        // assigns user a guestname when they connect
        guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
        // places user in lobby when they connect
        joinRoom(socket, 'Lobby');

        // handle user messages, namechanges, room connects
        handleMessageBroadcasting(socket, nickNames);
        handleNameChangeAttempts(socket, nickNames, namesUsed)
        handleRoomJoining(socket);

        // provides user with list of occupied rooms
        socket.on('rooms', function() {
            socket.emit('rooms', io.sockets.manager.rooms);
        });

        // define cleanup logic on disconnection
        handleClientDisconnection(socket, nickNames, namesUsed);
        });
};


