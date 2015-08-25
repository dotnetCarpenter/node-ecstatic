#!/usr/bin/env node

"use strict";

var request           = require('request')
  , ecstatic          = require('../lib/ecstatic')
  , http              = require('http')
  , path              = require('path')
  , port              = 9000
  , root              = path.join(__dirname, '../', '/public')
  , url               = 'http://localhost:' + port
  , uris              = [url + '/compress/foo.js.gz', url + '/a.txt', url + '/compress/foo.js']
  , whenServerIsReady = []
  , server            = http.createServer(
                          ecstatic({
                            root: root,
                            gzip: true,
                            autoIndex: true,
                            showDir: true
                          })
                        )

server.listen(port, function() {
  whenServerIsReady.forEach(function(fn) { fn() })
})

function getRequest() {
  var uri = uris[Math.floor(Math.random() * uris.length)]
  request.get({
    uri: uri
  , followRedirect: false
  //, headers: { 'If-Match': '*' }
  //, headers: { 'if-modified-since': Date.now() }
  }, function (err, res, body) {
    if (err) console.log(err), process.exit(1)

  //  console.dir(res)
    console.log("*******************************************\r\n")
    console.log('GET ' + uri)
    console.dir(res.headers)
  });
}

[1,2].forEach(function() {
  whenServerIsReady.push(getRequest)
})

setTimeout(function() {
  server.close()
}, 500)
