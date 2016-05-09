var http = require('http')
// var supevisor = require('supervisor')
// var path = require('path')
var cfg = require('./conf')
var url = require('url')
// var util = require('util')
// var querystring = require('querystring')
var router = require('./router')

function listen () {
  http.createServer(function (request, response) {
    // var lookup = path.basename(decodeURI(request.url))
    // var qry = querystring.parse(lookup)
    var url_parts = url.parse(request.url, true)
    var query = url_parts.query
    response.writeHead(200, {'Content-Type': 'text/html'})
    response.end('ok')
    router.routeJeedom(query)
  }).listen(cfg.DAEMON.listen)
}

module.exports.listen = listen
