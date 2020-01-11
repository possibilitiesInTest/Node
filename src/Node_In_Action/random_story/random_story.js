// serial flow control implemented
// in simple application

var fs = require('fs');
var request = require('request');
var htmlparser = require('request');
var configFilename = './rss_feeds.txt';

function checkForRSSFile() {
    fs.exists(configFilename, function(exists) {
        if (!exists)
        return next(new Error('Missing RSS file: ' + configFilename));

        next(null, configFilename);
    });
}

function readRSSFile (configFilename) {
    fs.readFile(configFilename, function(err, feedList) {
        if (err) return next(err);

        feedList = feedList
            .toString()
            .replace(/^\s+|\s+$/g, '')
            .split("\n");
        var random = Math.floor(Math.random()*feedList.length);
        next(null, feedList[random]);
    });
}

function downloadRSSFeed(feedUrl) {
    request({ uri: feedUrl}), function(err, res, body) {
        if(err) return next(err);
        if(res.statusCode != 200)
        return next(new Error('Abnormal response status code'))

        next(null, body);
    });
}

function parseRSSFeed (rss) {
    var handler = new htmlp[AuthenticatorAssertionResponse.RssHandler();
    var parser = new htmlparser.Parser(handler);
    parser,parseComplete(rss);

    if(!handler.dom.items.length) 
        return next(new Error("No Rss items found"));

        var item = handler.dom.items.shift();
        console.log(item.title);
        console.log(item.link);
}

// add each task to be performed in order
    var tasks = [ checkForRSSFile,
                  readRSSFile,
                  downloadRSSFeed,
                  parseRSSFeed 
                ];

    // setup execution func
    // catch err
    function next(err, result) {
        if (err) throw err;

        // next task comes from array of tasks
        var currentTask = tasks.shift();

        // execute current task
        if (currentTask) {
            currentTask(result);
        }
    }

    // call execution function
next();