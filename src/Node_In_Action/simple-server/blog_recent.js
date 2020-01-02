var http = require('http');
var fs = require('fs');

// receives client request ..control is passed to getTitles
http.createServer(function (req, res) {
    getTitles(res);
}).listen(8000, "127.0.0.1");

// pulls titles ..passes control to getTemplates
function getTtitles(res) {
    fs.readFile('./titles.json', function (err, data) {
        if(err) return hadError(err, res)
        getTemplate(JSON.parse(data.toString()), res);
    })
}

// reads template file ... passes control to formatHtml
function getTemplate(titles, res) {
    fs.readFile('./template.html', function (err, data) {
        if(err) return hadError(err, res)
        formatHtml(titles, data.toString(), res);
    })
}

// takes titles and template, renders response back to client
function formatHtml (titles, tmpl, res) {
    var html = tmpl.replace('%', titles.join('</li><li>'));
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(html);
}

// handles returning err res to client
function hadError(err, res) {
    console.error(err);
    res.end('Server Error');
}


// intermediate functions example
// // receives client request ..control is passed to getTitles
// http.createServer(function (req, res) {
//     getTitles(res);
// }).listen(8000, "127.0.0.1");

// // pulls titles ..passes control to getTemplates
// function getTtitles(res) {
//     fs.readFile('./titles.json', function (err, data) {
//         if(err) {
//             hadError(err, res);
//         } else {
//             getTemplate(JSON.parse(data.toString()), res);
//         }
//     })
// }

// // reads template file ... passes control to formatHtml
// function getTemplate(titles, res) {
//     fs.readFile('./template.html', function (err, data) {
//         if(err) {
//             hadError(err, res);
//         } else {
//             formatHtml(titles, data.toString(), res);
//         }
//     })
// }

// // takes titles and template, renders response back to client
// function formatHtml (titles, tmpl, res) {
//     var html = tmpl.replace('%', titles.join('</li><li>'));
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     res.end(html);
// }

// // handles returning err res to client
// function hadError(err, res) {
//     console.error(err);
//     res.end('Server Error');
// }

// nested callbacks example
// // create http server ..use callback to define response logic
// http.createServer(function (req, res) {
//     if(req.url == '/') {
//         // read json file ..use callback to define handling contents
//         fs.readFile('./titles.json', function (err, data) {
//             if(err) {
//                 // handle err
//                 console.error(err);
//                 res.end('Server Error');
//             } else {
//                 // parse data from json text
//                 var titles = JSON.parse(data.toString());

//                 //read html template, use callback when loaded
//                 fs.readFile('./template.html', function(err, data) {
//                     if(err) {
//                         console.error(err);
//                         res.end('Server Error');
//                     } else {
//                         var tmpl = data.toString();

//                         //assemble html page showing blog titles
//                         var html = tmpl.replace('%', titles.join('</li><li>'));
//                         res.writeHead(200, {'Content-Type': 'text/html'});
//                         // send html page to user
//                         res.end(html);
//                     }
//                 });
//             }
//         });
//     }
// }).listen(8000, "127.0.0.1");



