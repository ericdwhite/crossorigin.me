#!/usr/bin/env node
var http = require('http')
var request = require('request')
var fs = require('fs');
var domain = require('domain');
var index = fs.readFileSync('index.html');
var favicon = fs.readFileSync('favicon.ico');

var port = process.env.PORT || 8080
var AC_ALLOW_HEADERS = process.env.AC_ALLOW_HEADERS || 'Content-Type' 

console.log('Listenting on PORT: ' + port)
console.log('Access-Control-Allow-Headers: ' + AC_ALLOW_HEADERS)

var server = http.createServer(function (req, res) {
  var d = domain.create();
  d.on('error', function (e){
    console.log('ERROR', e.stack);
    res.statusCode = 500;
    res.end('Error: ' +  ((e instanceof TypeError) ? "make sure your URL is correct" : String(e)));
  });

  d.add(req);
  d.add(res);

  d.run(function() {
    handler(req, res);
  });

}).listen(port);
console.log('Started\n')

function handler(req, res) {
  console.log(req.url);
  switch (req.url) {
    case "/":
      res.writeHead(200);
    res.write(index);
    res.end();
    break;
    case "/index.html":
      res.writeHead(200);
    res.write(index);
    res.end();
    break;
    case "/favicon.ico":
      res.writeHead(200);
    res.write(favicon);
    res.end()
    default:
      try {
      res.setTimeout(25000);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
      res.setHeader('Access-Control-Allow-Credentials', false);
      res.setHeader('Access-Control-Allow-Headers', AC_ALLOW_HEADERS);
      if (req.method.toUpperCase() === 'OPTIONS') {
        res.statusCode = 200
        res.end()
      } else {
        // Proxy to the server
        var proxiedURL = req.url.slice(1)
        console.log('Proxy to: ' + req.method + ' ' + proxiedURL)

        var forwardHeaders = req.headers
        delete forwardHeaders.origin
        delete forwardHeaders.host

        var r = request(proxiedURL, {/*encoding: null,*/method: req.method, headers: forwardHeaders}, function(error, response, body) {
          if( error ) {
            console.log("Error:")
            console.log(error)
            return
          }
          res.statusCode = response.statusCode

          // Copy response headers
          for (var header in response.headers) {
            var value = response.headers[header];
            res.setHeader(header, value);
          }
          res.write(body)
          res.end()
        })
        //console.log("Request:")
        //console.log(r)
      }

    } catch (e) {
      console.log('ERROR', e.stack);
      res.end('Error: ' +  ((e instanceof TypeError) ? "make sure your URL is correct" : String(e)));
    }
  }
}
