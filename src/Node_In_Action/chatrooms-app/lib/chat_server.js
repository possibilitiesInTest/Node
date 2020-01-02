var socketio = require('socket.io');
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};

// invoked in server.js
exports.listen = function(server) {

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

        // handles user messages, namechanges, room connects
        handleMessageBroadcasting(socket, nickNames);
        handleNameChangeAttempts(socket, nickNames, namesUsed)
        handleRoomJoining(socket);

        // provides user with list of occupied rooms
        socket.on('rooms', function() {
            socket.emit('rooms', io.sockets.manager.rooms);
        });

        // defines clean up logic on disconnection
        handleClientDisconnection(socket, nickNames, namesUsed);
        });
};

// assigns guest name at connection
function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
    // generates new guest name
    var name = "Guest" + guestNumber;
    // associates connection id with guestName
    nickNames[socket.id] = name;
    //let user know their guestName
    socket.emit('nameResult', {
        success: true,
        name: name,
    });
    // note that guest name is now used
    namesUsed.push(name);
    //increment counter used to generate guest names
    return guestNumber + 1;
}

// joins room
function joinRoom(socket, room) {
    // joins room
    socket.join(room);
    // sets currentRoom
    currentRoom(socket.io) = room;
    // lets user know they have entered
    socket.emit('joinResult', {room: room});

    // notifies room users of new entry
    socket.broadcast.to(room).emit('message', {
        text: nickNames[socket.id] + 'has joined' + room + '.'
    });

    // define users in same room as user
    var usersInRoom = io.sockets.clients(room);

    // if users in room is positive
    if (usersInRoom.length > 1) {
        // list users in room, upon new entry
        var usersInRoomSummary = 'Users currently in ' + room + ': ';
        for (var index in usersInRoom) {
            if (userSocketId != socket.id) {
                if(index > 0) {
                    usersInRoomSummary += ', ';
                }
                usersInRoomSummary += nickNames[userSocket.Id];
            }
        }
        usersInRoomSummary += '.';
        // emits users in room to new user
        socket.emit('message', {text: usersInRoomSummary});
    }
}

// changes userName
function handleNameChangeAttempts(socket, nickNames, namesUsed) {

    // adds listener for 'nameAttempt' events
    socket.on('nameAttempt', function(name) {

        // don't allow names to begin with guest
        if(name.indexOf('Guest')  == 0) {
            socket.emit('nameResult', {
                success: false,
                message: 'Names cannot begin with "guest".'
            });
        } else {
        // if !registered, register name    
            if(namesUsed.indexOf(name)  == -1) {
                var previousName = nickNames[socket.id];
                var previousNameIndex = namesUsed.indexOf(previousName);
                namesUsed.push(name);
                nickNames[socket.id] = name;
                delete namesUsed[previousNameIndex];
                socket.emit('nameResult', {
                    success: true,
                    name: name
                });
                socket.broadcast.to(currentRoom[socket,id]).emit('message', {
                    text: previousName + ' is now known as ' + name + '.'
                });
            } else {
                // return err if name already in use
                socket.emit('nameResult', {
                    success: false,
                    message: 'That name is already in use.'
                });
            }
        }
    });
}

// sends chat messages
function handleMessageBroadcasting(socket) {
    socket.on('message', function(message) {
        socket.broadcast.to(message.room).emit('message', {
            text: nickNames[socket.id] + ': ' + message.text
        });
    });
}

// changes rooms
function handleRoomJoining(socket) {
    socket.on('join', function(room) {
        socket.leave(currentRoom[socket.id]);
        joinRoom(socket, room.newRoom);
    });
}

