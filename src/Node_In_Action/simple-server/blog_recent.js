var http = require('http');
var fs = require('fs');

// create http server ..use callback to define response logic
http.createServer(function (req, res) {
    if(req.url == '/') {
        // read json file ..use callback to define handling contents
        fs.readFile('./titles.json', function (err, data) {
            if(err) {
                // handle err
                console.error(err);
                res.end('Server Error');
            } else {
                // parse data from json text
                var titles = JSON.parse(data.toString());

                //read html template, use callback when loaded
                fs.readFile('./template.html', function(err, data) {
                    if(err) {
                        console.error(err);
                        res.end('Server Error');
                    } else {
                        var tmpl = data.toString();

                        //assemble html page showing blog titles
                        var html = tmpl.replace('%', titles.join('</li><li>'));
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        // send html page to user
                        res.end(html);
                    }
                });
            }
        });
    }
}).listen(8000, "127.0.0.1");
