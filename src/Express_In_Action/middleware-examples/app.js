var express = require("express");
var logger = require("morgan");
var http = require("http");

// connect-ratelimite
// Helmet
// cookie-parser
// response-time

// creates express aplication
var app = express();

// middleware that provides logging
app.use(logger("short"));
// app.use(function(request, response, next) {
//     console.log("In comes a request to: " + request.method + " to " + request.url);
//     next();
//     // response.end("Hello world");
// });

// sets up public path using Node's path module
var publicPath = path.resolve(__dirname, "public");
// sends static files from the publicPath directory
app.use(express.static(publicPath));

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
app.listen(3000);
console.log("Server is running at http://localhost:300");