#!/usr/bin/env node

"use strict";

var request   = require('request'),
    ecstatic  = require('../lib/ecstatic'),
    http      = require('http'),
    port      = 3000,
    root      = __dirname + '/public',
    uri       = 'http://localhost:' + port + 'compress/foo.js.gz',
    server    = http.createServer(
                  ecstatic({
                    root: root,
                    gzip: true,
                    autoIndex: true,
                    showDir: true
                  })
                )

function getRequest() {
  server.listen(port, function() {
    request.get({
      uri: uri
    , followRedirect: false
    , headers: { 'if-modified-since': Date.now() }
    }, function (err, res, body) {
      if (err) console.log(err), process.exit(1)

      console.dir(res)
      console.log("*******************************************\r\n")
      console.dir(res.headers)

      server.close()
    });
  })
}

[1,2].forEach(getRequest)
