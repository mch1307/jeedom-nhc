var cfg = require('./conf/conf')
var router = require('./lib/router')
var http = require('http')
var url = require('url')
var log = require('./lib/logger')
var nhc = require('./lib/nhc')
var jeedom = require('./lib/jeedom')
var persist = require('./lib/persist')
var Eq = require('./lib/equipment')

// Checking mandatory variables are defined
if (cfg.JEEDOM.host === undefined) {
  log.error('fatal error: JEEHOST not defined')
  throw new Error('fatal error: JEEHOST not defined')
}
if (cfg.JEEDOM.urlRoot === undefined) {
  log.error('fatal error: JEEURL not defined')
  throw new Error('fatal error: JEEURL not defined')
}
if (cfg.JEEDOM.apiKey === undefined) {
  log.error('fatal error: JEEAPI not defined')
  throw new Error('fatal error: JEEAPI not defined')
}
if (cfg.NHC.host === undefined) {
  log.error('fatal error: NHCHOST not defined')
  throw new Error('fatal error: NHCHOST not defined')
}

// init niko home control data
// starts listening for NHC events
log.info('initializing nhc data')
nhc.initNhc()

// init Jeedom data
log.info('initializing jeedom data')
log.debug('initializing jeedom locations')
jeedom.initNewLoc()
log.debug('initializing jeedom equipments')
jeedom.initEq()

// start listening for Jeedom events
log.info('starting http listener')
http.createServer(function (request, response) {
  var url_parts = url.parse(request.url, true)
  var query = url_parts.query
  response.writeHead(200, {'Content-Type': 'text/html'})
  response.end('ok')
  router.routeJeedom(query)
}).listen(cfg.DAEMON.listen)
log.info('http listening on ' + cfg.DAEMON.listen)

// Update jeedom status based on nhc current state logged in db
setTimeout(function () {
  persist.getAllNh(function (allNE) {
    for (var i = 0; i < allNE.length; i++) {
      var eq = new Eq(allNE[i].id, 'n', allNE[i].value1)
    }
  })
}, 6000)
