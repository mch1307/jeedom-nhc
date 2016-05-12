var cfg = require('../conf/conf')
var persist = require('./persist')
var rpc = require('node-json-rpc')
var log = require('./logger')

var rpcOpt = {
  port: cfg.JEEDOM.port,
  host: cfg.JEEDOM.host,
  path: cfg.JEEDOM.apiPath
}

var jCli = new rpc.Client(rpcOpt)
function cmdById (eq) {
  var params = {
    'jsonrpc': '2.0',
    'method': 'cmd::byEqLogicId',
    'id': '0',
    'params': {
      'apikey': cfg.JEEDOM.apiKey,
      'eqLogic_id': eq.id
    }
  }
  jCli.call(params, function (err, cmds) {
    if (err) {
      log.error('Error in cmdById ', err)
      throw err
    }
    process.nextTick(function () {
      for (var i = 0; i < cmds.result.length; i++) {
        if (cmds.result[i].name === 'on') {
          eq.stateId = cmds.result[i].id
          eq.cmdOn = cmds.result[i].id
          eq.subType = cmds.result[i].subType
        } else if (cmds.result[i].name === 'off') {
          eq.cmdOff = cmds.result[i].id
        } else if (cmds.result[i].name === 'updState') {
          eq.updId = cmds.result[i].id
        }
      }
      persist.initJeedomEq(eq)
    })
  })
}

module.exports = {
  initNewLoc: function () {
    var params = {
      'jsonrpc': '2.0',
      'method': 'object::all',
      'id': '0',
      'params': {
        'apikey': cfg.JEEDOM.apiKey
      }
    }
    jCli.call(params, function (err, locations) {
      if (err) throw err
      for (var i = 0; i < locations.result.length; i++) {
        var loc = {id: locations.result[i].id, name: locations.result[i].name}
        persist.initJeedomLoc(loc)
      }
    })
  },
  initEq: function () {
    var params = {
      'jsonrpc': '2.0',
      'method': 'eqLogic::byType',
      'id': '0',
      'params': {
        'apikey': cfg.JEEDOM.apiKey,
        'type': 'script'
      }
    }
    jCli.call(params, function (err, equ) {
      if (err) {
        log.error('Error in initEq ',err)
        throw err
      }
      process.nextTick(function (eq) {
        for (var i = 0; i < equ.result.length; i++) {
          eq = {}
          eq.id = equ.result[i].id
          eq.name = equ.result[i].name
          eq.location = equ.result[i].object_id
          eq.type = equ.result[i].eqType_name
          cmdById(eq)
        }
      })
    })
  }
/*  getAllScripts: function (rsp) {
    var params = {
      'jsonrpc': '2.0',
      'method': 'eqLogic::byType',
      'id': '0',
      'params': {
        'apikey': cfg.JEEDOM.apiKey,
        'type': 'script'
      }
    }
    jCli.call(params, function (err, eqScripts) {
      if (err) {
        log.error('Error in getAllScripts', err)
        throw err
      }
      rsp(eqScripts)
    })
  },
  eqById: function (id, rsp) {
    var params = {
      'jsonrpc': '2.0',
      'method': 'eqLogic::fullById',
      'id': '0',
      'params': {
        'apikey': cfg.JEEDOM.apiKey,
        'id': id
      }
    }
    jCli.call(params, function (err, eqFull) {
      if (err) {
        log.error('Error in eqById ', err)
        throw err
      }
      rsp(eqFull)
    })
  }*/
}
