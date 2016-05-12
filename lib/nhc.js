var net = require('net')
var cfg = require('../conf/conf')
var log = require('./logger')
var router = require('./router')
var re = /\r\n|\n\r|\n|\r/g

function nhcListen () {
  var nhcListen = new net.Socket({ readable: true, writable: true })
  nhcListen.setEncoding('utf8')
  nhcListen.setKeepAlive(true, cfg.NHC.keepAlive)
  try {
    nhcListen.connect(cfg.NHC.port, cfg.NHC.host)
  } catch (err) {
    log.error('Unable to connect to NHC: ', err)
  }
  log.debug('nhc nhcListen connected to: ' + cfg.NHC.host)

  nhcListen.on('data', function (data) {
    var allMsg = data.replace(re, '\n').split('\n')
    allMsg.forEach(function (oneMsg, i) {
      if (oneMsg) {
        log.debug('nhc listen: ' + oneMsg)
        router.routeNhc(oneMsg)
        log.debug('nhc nhcListen routed: ' + oneMsg)
      }
    })
  })
  log.debug('nhcListen sending init niko msg')
  nhcListen.write(cfg.NHC.registerMsg)
}

function sendNhcCmd (nhcCmd) {
  var tmpSocket = new net.Socket({
    readable: true,
    writable: true
  })
  tmpSocket.setEncoding('utf8')
  try {
    tmpSocket.connect(cfg.NHC.port, cfg.NHC.host)
  } catch (err) {
    log.error('Unable to connect to NHC ', err)
  }
  process.nextTick(function () {
    tmpSocket.write(nhcCmd)
    log.debug('nhc sent cmd: ' + nhcCmd)
  })
  setTimeout(function () {
    tmpSocket.destroy()
  }, 800)
}

function initNhc () {
  var initSocket = new net.Socket()
  initSocket.setEncoding('utf8')
  try {
    initSocket.connect(cfg.NHC.port, cfg.NHC.host)
  } catch (err) {
    log.error('Unable to connect to NHC ', err)
  }
  initSocket.on('data', function (data) {
    router.routeNhc(data)
    setTimeout(function () {
      initSocket.destroy()
    }, 1000)
  })
  setTimeout(function () {
    initSocket.write(cfg.NHC.equMsg)
    log.debug('nhc initNhc sent cmd: ' + cfg.NHC.equMsg)
  }, 100)
  setTimeout(function () {
    initSocket.write(cfg.NHC.locMsg)
    log.debug('nhc initNhc sent cmd: ' + cfg.NHC.locMsg)
  }, 200)
  setTimeout(function () {
    nhcListen()
  }, 1000)
}

module.exports.initNhc = initNhc
module.exports.sendNhcCmd = sendNhcCmd
