#!/usr/bin/env node

"use strict";

var request           = require('request')
  , ecstatic          = require('../lib/ecstatic')
  , http              = require('http')
  , path              = require('path')
  , port              = 9000
  , root              = path.join(__dirname, '../', '/public')
  , uri               = 'http://localhost:' + port + '/compress/foo.js.gz'
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
  request.get({
    uri: uri
  , followRedirect: false
  , headers: { 'if-modified-since': Date.now() }
  }, function (err, res, body) {
    if (err) console.log(err), process.exit(1)

  //  console.dir(res)
    console.log("*******************************************\r\n")
    console.dir(res.headers)

    server.close()
  });
}

[1].forEach(function() {
  whenServerIsReady.push(getRequest)
})
