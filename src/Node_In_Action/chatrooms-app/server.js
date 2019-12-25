var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');

var cache = {};

// returns 404 page
function send404(response) {
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.write('Error 494: resource not found');
    response.end();
}

// sends file contents
function sendFile(response, filePath, fileContents) {
    response.writeHead(
        200,
        {"content-type": mime.lookup(path.basename(filePath))}
    );
    response.end(fileContents);
}

// if file exists > serve from cache
// else return 404
function serveStatic(response, cache, absPath) {
    if(cache[abspath]){
        sendFile(response, absPath, cache[absPath]);
    } else {
        fs.exists(absPath, function(exists) {
            if (exists) {
                fs.readFile(absPath, function (err, data) {
                    if(err) {
                        send404(response);
                    } else {
                        cache[absPath] = data;
                        sendFile(response, absPath, data);
                    }
                });
            } else {
                send404(response);
            }
        });
    }
}