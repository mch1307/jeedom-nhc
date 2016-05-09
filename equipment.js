var request = require('request')
var cfg = require('./conf')
var nhc = require('./nhc')
var util = require('util')
var querystring = require('querystring')
var log = require('./logger')
var persist = require('./persist')

function switchJeedom () {
  var jeeUrl = cfg.JEEDOM.apiUrl + querystring.stringify(this.apiUrlQry)
  log.debug('eq switchJeedom: ' + jeeUrl)
  request(jeeUrl, function (error, response, body) {})
}

function switchNhc () {
  var nCmd = '{ "cmd":"executeactions","id":' + this.nhcId + ',"value1":' + this.state + '}'
  log.debug(nCmd)
  nhc.sendNhcCmd(nCmd)
}

function init (originator, eq, value) {
  log.debug('equipment: init called from ' + originator, ' with value ' + value)
  this.nhcId = eq.nhcId
  this.name = eq.name
  this.type = eq.type
  this.subType = eq.subType
  this.updState = eq.updState
  this.jeeId = eq.jeeId
  this.jeeStateId = eq.jeeStateId
  this.cmdOn = eq.cmdOn
  this.cmdOff = eq.cmdOff
  this.state = value
  this.location = eq.location
  this.apiUrlQry = cfg.URLQRY
  if (eq.type === 'script') {
    this.apiUrlQry.type = 'cmd'
  }
  if (this.updState) {
    this.apiUrlQry.slider = this.state
    this.apiUrlQry.id = this.updState
  }
  if (this.nhcId && this.jeeId) {
    if (originator === 'n') {
      // log.debug('calling jeedom switch')
      switchJeedom()
    }
    else if (originator === 'j') {
      // log.debug('calling nhc switch')
      switchNhc()
    }
  }
}

function Eq (id, originator, value) {
  var eq = {}
  if (originator === 'n') {
    eq = persist.getEqByNhc(id)
  }
  else if (originator === 'j') {
    eq = persist.getEqByJeedom(id)
  }
  if (eq) {
    init(originator, eq, value)
  }
}

Eq.prototype.debug = function () {
  console.log('Eq debug: ' + util.inspect(this.id, false, null))
}

module.exports = Eq
