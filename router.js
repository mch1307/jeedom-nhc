var jsqry = require('json-query')
// var initDb = require('./init-db')
var Eq = require('./equipment')
var util = require('util')
var persist = require('./persist')
var log = require('./logger')

function routeJeedom (jeeEvent) {
  // console.log('routeJeedom: '+jeeEvent.id)
  var eq = new Eq(jeeEvent.id, 'j', jeeEvent.value)
}

function routeNhc (nhcEvent) {
  var jsNhc = JSON.parse(nhcEvent)
  // get event type
  if (jsNhc.hasOwnProperty('cmd')) {
    if (jsNhc.cmd === 'listlocations') {
      persist.initNhcLoc(nhcEvent)
    }
    else if (jsNhc.cmd === 'listactions') {
      // initialize equipment objects
      persist.initNhcEq(nhcEvent)
    }
  }
  else if (jsNhc.hasOwnProperty('event')) {
    log.debug('event received')
    for (var i = 0; i < jsNhc.data.length; i++) {
      var eq = new Eq(jsNhc.data[i].id, 'n', jsNhc.data[i].value1)
    }
  }
}

module.exports.routeJeedom = routeJeedom
module.exports.routeNhc = routeNhc
