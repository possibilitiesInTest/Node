var http = require("http");
var path = require("path");
var express = require("express");
var logger = require("morgan");
var bodyparser = require("body-parser");

var app = express();

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

var entries =[];
app.locals.entries = entries;

// use morgan as logger
app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: false }));

// renders homepage at point root
app.get("/", function(request, response) {
    response.render("index");
});

// redirect to create route
app.get("/new-entry", function(request, response) {
    response.render("new-entry");
});

// if post to new-entry is without entries, return 404
app.post("/new-entry", function(request, response) {
    if (!request.body.title || !request.body.body) {
        response.status(400).send("Entries must have a title and a body.");
        return;
    }
    // pushes ne entries to new-entry route
    entries.push({
        title: request.body.title,
        content: request.body.body,
        published: new Date();
    });
    // redirect to home
    response.redirect("/");
});

// sets up 404 err page
app.use(function(request, response) {
    response.status(404).render("404");
});

// starts server on specified port
http.createServer(app).listen(3000, function() {
    console.log("guestbook app started on port 3000.");
});