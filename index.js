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
        //console.log(forwardHeaders)

        var r = request(proxiedURL, {encoding: null, headers: forwardHeaders}, function(error, response, body) {
          //console.log('Proxied headers:')
          //console.log(response.request.headers)
          //console.log(response.statusCode)
          res.statusCode = response.statusCode
          res.write(body)
          res.end()
        })
      }

    } catch (e) {
      console.log('ERROR', e.stack);
      res.end('Error: ' +  ((e instanceof TypeError) ? "make sure your URL is correct" : String(e)));
    }
  }
}
