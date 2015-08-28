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
  , server            = http.createServer(
                          ecstatic({
                            root: root,
                            gzip: true,
                            autoIndex: true,
                            showDir: true
                          })
                        )
  , probe = {
      probes: []
    , add: function(fn) {
        this.probes.push(fn)
        return this
      }
    , times: function(num) {
        num = Number(num) - 1
        var lastFn = this.last()
        for(var start = 0, end = start + num; start < end; start++) {
          this.probes.push(lastFn)
        }
        return this
      }
    , last: function() {
        return this.probes[this.probes.length - 1]
      }
    , clear: function() {
        while(this.probes.length > 0) this.probes.pop()
        return this
      }
    }

//debug
require("request-debug")(request)
//request.debug = true

probe.add(getRequest).times(2)

server.listen(port, function() {
  probe.probes.forEach(function(fn) { fn() })
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
    console.log('GET ' + uri)
    console.dir(res.headers)
    console.log("*******************************************\r\n")
  });
}

setTimeout(function() {
  server.close()
}, 500)
