var cfg = require('../conf/conf')
// var log4js = require('log4js')
var bunyan = require('bunyan')

var logopt = {
  name: 'jeedom-nhc',
  streams: [{
    type: 'rotating-file',
    path: cfg.DAEMON.logFile,
    level: cfg.DAEMON.logLevel
  }]
}

var log = bunyan.createLogger(logopt)

module.exports = log
