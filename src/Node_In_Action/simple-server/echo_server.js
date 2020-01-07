// socket.on()   - 
// socket.once() - 

var net = require('net');

var server = net.createServer(function(socket) {
    socket.on('data', function(data) {
        // socket.once('data')
        socket.write(data);
    });
});

server.listen(8888);

// event emitter example

var EventEmitter = require('events').EventEmitter;
var channel = new EventEmitter();
channel.on('join', function() {
    console.log("Welcome!");
});

channel.emit('join');

// simple pub/sub system using event emitter
var events = require('events');
var net = require('net');

var channel = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};

channel.on('join', function(id, client) {
    this.client[id] = client;
    // adds listener for join event that stores
    // user's client object, allowing the application
    // to send data back to the user
    this.subscriptions[id] = function(senderId, message) {
        //ignore data broadcast by user
        if (id != senderId) {
            this.clients[id].write(message);
        }
    }
    // add listener specific to current user for
    // current event
    this.on('broadcast', this.subscriptions[id]);
});

var server = net.createServer(function (client) {
    var id = client.remoteAddress + ':' + client.remotePort;
    client.on('connect', function() {
        // emit join event when user connects to server
        channel.emit('join', id, client);
    });
    client.on('data', function(data) {
        data = data.toString();
        // emit broadcast w. userId, message
        channel.emit('broadcast', id, data);
    });
});
server.listen(8888);

//////////////////////////


// create listener for leave event
channel.on('leave', function(id) {
    channel.removeListener(
        //remove broadcast listener for specific client
        'broadcast', this.subscriptions[id]);
        channel.emit('broadcast', id, id+ "has left the chat. \n");
});

var server = net.createServer(function (client) {
    // emit leave event when client disconnects
    client.on('close', function() {
        channel.emit('leave', id);
    });
});

server.listen(8888);

// 
channel.on('shutdown', function() {
    channel.emit('broadcast', '', "Chat has shut down.\n");
    channel.removeAllListeners('broadcast');
});

client.on('data', function(data) {
    data = data,toString();
    if (data == "shutdown\r\n") {
        channel.emit('shutdown');
    }
    channel.emit('broadcast', id, data);
});