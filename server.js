var express = require('express');
var app = express();
var Cylon = require('cylon')
var config = require('./config/config')
var sensors = require('./config/sensors')
var outputs = require('./config/outputs')

var staticServer = require('http').Server(app)
staticServer.listen(8080)

var socket = require('./config/socket')(staticServer)
var buttonComponent = require('./components/buttons')(socket)
var sensorComponent = require('./components/sensors')(sensors,socket)

app.use(express.static(__dirname + '/public'))

//Read the sensors that Cylon is going to listen
var getDevices = function() {
  var deviceObj = {}
  for(var sensorName in sensors) {
    var sensor = sensors[sensorName]
    if(sensors[sensorName].enabled) deviceObj[sensorName] = sensors[sensorName]
  }
  console.log("getDevices setting up: " + JSON.stringify(deviceObj))
  return deviceObj
}

Cylon.robot({
  connections: {
    edison: { adaptor: 'intel-iot' }
  },

  devices: getDevices(),

  work: function(my) {
    every((config.pollInterval).second(), function() {
      sensorComponent.readAllSensors(my);
    })
  }
}).on('ready',function(my) {
  buttonComponent.registerCompositionHandler(my)
}).on('ready',function(my) {
  buttonComponent.registerSocketHandlers(my)
})

Cylon.start()
