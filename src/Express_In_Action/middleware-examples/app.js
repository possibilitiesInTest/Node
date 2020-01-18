var express = require("express");
var http = require("http");

// creates express aplication
var app = express();

// middleware that provides logging
app.use(function(request, response, next) {
    console.log("In comes a request to: " + request.method + " to " + request.url);
    next();
    // response.end("Hello world");
});

// middleware that changes response based on time
app.use(function(req, res, next) {
    var minute = (new Date()).getMinutes();
    if((minute % 2) === 0) {
        next();
    } else {
        res.statusCode = 403;
        res.end("Not authorized.");
    }
});

// sends response
app.use(function(request, response) {
    response.writeHead(200, {"Content-Type": "text/plain" });
    response.end("Secret info: 'Swordfish!'");
});

// starts the server
http.createServer(app).listen(3000);
console.log("Server is running at http://localhost:300");