
// Chat - as a class definition
// with socket set at instantiation
var Chat = function(socket) {
    this.socket = socket;
};


// sends chat messages
Chat.prototype.sendMessage = function(room, text) {
    var message = {
        room: room,
        text:text
    };
    this.socket.emit('join', {
        newRoom: room
    });
};

// changes rooms
Chat.prototype.changeRoom = function(room) {
    this.socket.emit('join', {
        newRoom: room
    });
};

// handles chat commands
Chat.prototype.processCommand = function(command) {
    var words = command.split(' ');
    // parse name from first word
    var command = words[0].substring(1, words[0].length).toLowerCase();
    var message = false;
    switch(command) {
        // handle join / change rooms
        case 'join':
            words.shift();
            var room = words.join(' ');
            this.changeRoom(room);
            break;
        // handle name change
        case 'nick':
            words.shift();
            var name = words.join(' ');
        default:
            message = 'Unrecognized command.';
            break;
    }
    return message;
};