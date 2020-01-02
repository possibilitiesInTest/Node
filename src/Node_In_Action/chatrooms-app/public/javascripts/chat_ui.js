

// sanitize incoming input with div encapsulation
function divEscapedContentElement(message) {
    return $('<div></div>').text(message);
}

// display trusted content from system
function divSystemContentElement(message) {
    return $('<div></div>').html('<i>' + message + '</i>');
}

// processes user input after cleaning
function processUserInput(chatApp, socket) {
    var message = $('#send-message').val();
    var systemMessage;

    //if user input begins with slash, treat it as command
    if (message.chartAt(0) == '/') {
        systemMessage = chatApp.processCommand(message);
        if(systemMessage) {
            $('#message').append(divSystemContentElement(systemMessage));
        }
    } else {
        // broadcast non-command input to other users
        chatApp.sendMessage($('#room').text(), message);
        $('#messages').append(divEscapedContentElement(message));
        $('#message').scrollTop($('#messages').prop('scrollHeight'));
    }
    $('#send-message').val('');
}

// client-side initiation of SocketIO event handling
var socket = io.connect();

$(document).ready(function() {
    var chatApp = new Chat(socket);

    // display result of name-change attempt
    socket.on('nameResult', function(result) {
        var message;

        if (result.success) {
            message = 'You are now known as ' + result.name + '.';
        } else {
            message = result.message;
        }
        $('#messages').append(divSystemContentElement(message));
    });

    // display result of a room change
    socket.on('joinResult', function(result) {
        $('#room').text(result.room);
        $('#message').append(divSystemContentElement('Room changed.'));
    });

    // display received message
    socket.on('message', function (message) {
        var newElement = $('<div></div>').text(message.text);
        $('#messages').append(newElement);
    });

    //display list of rooms available
    socket.on('rooms', function(rooms) {
        $('#room-list').empty();
        for(var room in rooms) {
            room = room.substring(1, room.length);
            if (room != '') {
                $('#room-list').append(divExcapedContentElement(room));
            }
        }
        // allow click of a room to change to that room
        $('#room-list div').click(function() {
            chatApp.processCommand('/join' + $(this).text());
            $('#send-message').focus();
        });
    });
    // request list of rooms available intermittently
    setInterval(function() {
        socket.emit('rooms');
    }, 1000);

        $('#send-message').focus();

        // allow submitting form to send chat message
        $(send-form).submit(function() {
            processUserInput(chatApp, socket);
            return false;
        });
});