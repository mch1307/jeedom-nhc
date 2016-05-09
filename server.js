var cfg = require('./conf')
var log = require('./logger'); // .init('main')
var nhc = require('./nhc')
var util = require('util')
var jeedom = require('./jeedom')
var listener = require('./listener')
var persist = require('./persist')
var Eq = require('./equipment')

// init niko home control data
// starts listening for NHC events
log.info(util.inspect(cfg, false, null))
log.info('nhcd starting')
nhc.initNhc()
log.debug('nhc init ok')

// init Jeedom data
log.info('initializing jeedom')
log.debug('initializing jeedom locations')
jeedom.initNewLoc()
log.debug('initializing jeedom equipments')
jeedom.initEq()

// start listening for Jeedom events
log.info('starting jeedom listener')
listener.listen()
log.info('init started')

// Update jeedom status based on nhc current state logged in db
setTimeout(function () {
  persist.getAllNh(function (allNE) {
    // console.log(allNE)
    for (var i = 0;i < allNE.length;i++) {
      // console.log(allNE[i].name)
      var eq = new Eq(allNE[i].id, 'n', allNE[i].value1)
    }
  })
}, 6000)
