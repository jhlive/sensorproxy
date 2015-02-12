var sensors = require('../config/sensors')
var guid = require('easy-guid')
var poster = require('../poster')

module.exports = {
  registerSocketHandlers:function(my, socket) {
    for(var sensorName in sensors) {
      var sensor = my[sensorName];

      if(!sensors.hasOwnProperty(sensorName)) continue
      if(!sensors[sensorName].enabled == true) continue

      if(sensors[sensorName].driver=='button') {
        //install handlers
        console.log("installing socket handler for sensor: " + JSON.stringify(my[sensorName]))
        var controlEventPush = sensors[sensorName].controlEventPush;
        my[sensorName].on('push',function() {
          if (socket) {
            socket.emit(controlEventPush, {time: (new Date()).getTime()});
          }
        })

        var controlEventRelease = sensors[sensorName].controlEventRelease;
        my[sensorName].on('release',function() {
          if (socket) {
            socket.emit(controlEventRelease, {time: (new Date()).getTime()});
          }
        })
      }
    }
  },

  //add individual handlers here
  registerCompositionHandler : function(my) {
    if (my.compositionButton != undefined) {
      my.compositionButton.on('push', function() {
        console.log("adding composition")
        // post new composition
        var composition = {
          "name": guid.new(16),
          "tempo": 80,
          "created_by": 1,
          "created_at": (new Date()).getTime()
        }

        poster.postComposition(composition, function(err,data) {
          if (err) {
            return console.log("couldn't post new composition: " + JSON.stringify(err))
          }
          console.log(JSON.stringify(data))
          //also write it to LED
        })
      })
    }
  }
}
