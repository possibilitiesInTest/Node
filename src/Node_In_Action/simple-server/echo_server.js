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

// returns array of listeners for given event type
channel.on('join', function(id, client) {
    var welcome = "Welcome!\n" + 'Guests online: ' + this.listeners('broadcast').length;
    client.write(welcome + "\n");
});

// sets max listeners
channel.setMaxListeners(50);

// err handling example
var events = require('events');
var myEmitter = new events.EventEmitter();

myEmitter.on('error', function(err) {
    console.log('ERROR: ' + err.message);
});

myEmitter.emit('error', new Error('Something is wrong.'));

process.on('uncaughtException', function(err) {
    console.error(err.stack);
    process.exit(1);
});

// file watcher example w. eventEmitter
function Watcher(watchDir, processedDir) {
    this.watchDir = watchDir;
    this.processedDir = processedDir;
}

var events = require('events'),
 util = require('util');

util.inherits(Watcher, events.EventEmitter);

Watcher.prototype = new events.EventEmitter();

var fs = require('fs')
   , watchDir = './watch'
   , processedDir = './done';

Watcher.prototype.watch = function() {
    var watcher = this;
    fs.readdor(this.watchDir, function(err, files) {
        if (err) throw err;
        for(var index in files) {
            watcher.emit('progress', files[index]);
        }
    });
}

Watcher.prototype.start = function() {
    var watcher = this;
    fs.watchFile(watchDir, function() {
        watcher.watch();
    });
}

var watcher = new Watcher(watchDir, porocessedDir);

watcher.on('process', function process(file) {
    var watchFile = this.watchDir + '/' + file;
    var processedFile = this.processedDir + '/' + file.toLowerCase();

    fs.rename(watchFile, processedFile, function(err) {
        if(err) throw err;
    });
});

watcher.start();