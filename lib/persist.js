var Loki = require('lokijs')
var db = new Loki('db')
var log = require('./logger')
var util = require('util')

var jEq = db.addCollection('jEq', {unique: ['id']})
var jLoc = db.addCollection('jLoc', {unique: ['id']})
var nEq = db.addCollection('nEq', {unique: ['id']})
var nLoc = db.addCollection('nLoc', {unique: ['id']})

var initNhcLoc = function (nhcLocData) {
  var jsNhc = JSON.parse(nhcLocData)
  for (var i = 0; i < jsNhc.data.length; i++) {
    nLoc.insert(jsNhc.data[i])
    log.debug('initNhcLoc inserted: ' + util.inspect(jsNhc.data[i], false, null))
  }
}

var initNhcEq = function (nhcEquData) {
  var jsNhc = JSON.parse(nhcEquData)
  for (var i = 0; i < jsNhc.data.length; i++) {
    nEq.insert(jsNhc.data[i])
    log.debug('initNhcEq inserted: ' + util.inspect(jsNhc.data[i], false, null))
  }
}

var initJeedomEq = function (eq) {
  var jeeEq = {
    id: eq.id,
    name: eq.name,
    location: eq.location,
    stateId: eq.stateId,
    type: eq.type,
    subType: eq.subType,
    cmdOn: eq.cmdOn,
    cmdOff: eq.cmdOff,
    updId: eq.updId
  }
  jEq.insert(jeeEq)
  log.debug('initJeedomEq inserted: ' + util.inspect(jeeEq, false, null))
}

var initJeedomLoc = function (jeeLoc) {
  jLoc.insert(jeeLoc)
  log.debug('initJeedomLoc inserted: ' + util.inspect(jeeLoc, false, null))
}

var getEqByNhc = function (id) {
  // from nhc equi, get nhc location
  // then get jeedom location id
  // and then jeedom object by name and loc
  log.debug('getEqByNhc - id: ' + id)
  var tmpNE
  var tmpJE
  try {
    tmpNE = nEq.findOne({
      'id': id
    })
    log.debug('getEqByNhc - found nhc: ' + util.inspect(tmpNE, false, null))
    var tmpNL = nLoc.findOne({
      'id': tmpNE.location
    }).name
    log.debug('getEqByNhc - found nhc loc: ' + util.inspect(tmpNL, false, null))
    var tmpJL = jLoc.findOne({
      'name': {
        '$regex': [ tmpNL, 'i' ]
      }
    }).id
    log.debug('getEqByNhc - found JLOC: ' + util.inspect(tmpJL, false, null))

    tmpJE = jEq.findOne({
      '$and': [ {
        'location': tmpJL
      }, {
        'name': {
          '$regex': [ tmpNE.name, 'i' ]
        }
      }, {
        'name': {
          '$len': tmpNE.name.length
        }
      }
      ]
    })
    log.debug('getEqByNhc - found Jequip: ' + util.inspect(tmpJE, false, null))
  } catch (e) {
    log.error('persist.getEqByNhc ' + e)
  }
  var eq = {}
  try {
    eq.nhcId = tmpNE.id
    eq.name = tmpJE.name
    eq.type = tmpJE.type
    eq.subType = tmpJE.subType
    eq.updState = tmpJE.updId
    eq.stateId = tmpJE.stateId
    eq.jeeId = tmpJE.id
    eq.cmdOn = tmpJE.cmdOn
    eq.cmdOff = tmpJE.cmdOff
  } catch (e) {
    log.error('persist.getEqByNhc ' + e)
  }
  log.debug('persist eq:' + util.inspect(eq, false, null))
  return eq
}

var getEqByJeedom = function (id) {
  // get jeedom location name
  // then search for the corresponding nhc loc id
  // then get the nhc object
  var eq
  var tmpJE
  var tmpNE
  try {
    eq = {}
    tmpJE = jEq.findOne({
      'id': id
    })
    var tmpJL = jLoc.findOne({
      'id': tmpJE.location
    }).name
    var tmpNL = nLoc.findOne({
      'name': {
        '$regex': [ tmpJL, 'i' ]
      }
    }).id
    tmpNE = nEq.findOne({
      '$and': [ {
        'location': tmpNL
      }, {
        'name': {
          '$regex': [ tmpJE.name, 'i' ]
        }
      } ]
    })
  } catch (e) {
    log.error('persist.getEqByNhc ' + e)
  }
  try {
    eq.nhcId = tmpNE.id
    eq.name = tmpJE.name
    eq.type = tmpJE.type
    eq.subType = tmpJE.subType
    eq.updState = tmpJE.updId
    eq.stateId = tmpJE.stateId
    eq.jeeId = tmpJE.id
    eq.cmdOn = tmpJE.cmdOn
    eq.cmdOff = tmpJE.cmdOff
  } catch (e) {
    log.error('persist.getEqByNhc ' + e)
  }
  log.debug('persist: ' + eq.jeeId)
  return eq
}

function getAllNh (cb) {
  var allEq = nEq.chain()
    .data()
  cb(allEq)
}

module.exports.initNhcEq = initNhcEq
module.exports.getEqByJeedom = getEqByJeedom
module.exports.initNhcLoc = initNhcLoc
module.exports.getEqByNhc = getEqByNhc
module.exports.initJeedomEq = initJeedomEq
module.exports.initJeedomLoc = initJeedomLoc
module.exports.getAllNh = getAllNh
