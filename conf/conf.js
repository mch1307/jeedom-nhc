var path = require('path')
var cfg = {}

cfg.JEEDOM = {}
cfg.NHC = {}
cfg.DAEMON = {}

cfg.DAEMON.logFile = path.join(__dirname, '../log/jeedom-nhc.log')
cfg.DAEMON.logLevel = process.env.LOGLEVEL || 'INFO'
cfg.DAEMON.listen = process.env.LISTEN || 8081

cfg.JEEDOM.host = process.env.JEEHOST
cfg.JEEDOM.urlRoot = process.env.JEEURL
cfg.JEEDOM.apiPath = '/core/api/jeeApi.php?'
cfg.JEEDOM.apiUrl = cfg.JEEDOM.urlRoot + cfg.JEEDOM.apiPath
cfg.JEEDOM.apiKey = process.env.JEEAPI

cfg.NHC.host = process.env.NHCHOST
cfg.NHC.port = process.env.NHCPORT || 8000
cfg.NHC.keepAlive = process.env.NHCKEEPALIVE || 60000
cfg.NHC.registerMsg = '{"cmd":"startevents"}'
cfg.NHC.equMsg = '{"cmd":"listactions"}'
cfg.NHC.locMsg = '{"cmd":"listlocations"}'

cfg.URLQRY = {
  apikey: cfg.JEEDOM.apiKey,
  type: undefined,
  id: undefined
}
module.exports = cfg
