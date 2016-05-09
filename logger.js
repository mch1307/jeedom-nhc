var cfg = require('./conf')
// var log4js = require('log4js')
var bunyan = require('bunyan')

var logopt = {
  name: 'nhcd',
  streams: [{
    type: 'rotating-file',
    path: cfg.DAEMON.logFile,
    level: cfg.DAEMON.logLevel
}]}

var log = bunyan.createLogger(logopt)

module.exports = log
