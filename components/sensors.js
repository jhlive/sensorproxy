var poster = require('../poster')

module.exports = function(sensors,socket) {
  var scaleFactor = 5;

  var postSensorReading = function(sensor,reading) {
    var note = {
      value: reading,
      sensor_type: sensor.description,
      time: (new Date()).getTime()
    }

    poster.postNote(note,function(err){
      if(err) {
        console.log("error posting: " + JSON.stringify(err))
      }
    })

    if (socket) {
      socket.emit('noteReceived', note);
    }
  }

  var readSensor = function(sensor){
    if(!sensor) return
    if(sensors[sensor.name].driver=='button') return

    console.log("readSensor from sensor " + JSON.stringify(sensor))
    var logslider = require('../logslider')(sensor.lowerLimit,sensor.upperLimit,1,100);

    var value;
    if(sensors[sensor.name].driver=='analogSensor') {
      value = sensor.analogRead();
      console.log("got analog read")
    }

    if(sensors[sensor.name].driver=='digitalSensor') {
      value = sensor.digitalRead(function(){
        console.log("got digital read")
      });
    }

    // var noteValue = logslider.logslider(value)
    var noteValue = logslider.logslider(value)

    if(sensors[sensor.name].invert) {
      noteValue = 1/noteValue * 100
    }

    noteValue *= scaleFactor

    console.log(sensor.name + ' noteValue => ', noteValue)

    sensor.on('lowerLimit', function(val) {
      console.log(sensor.name + " lower limit reached, value => ", val)
    })

    sensor.on('upperLimit', function(val) {
      console.log(sensor.name + " upper limit reached, value => ", val)
    })
    return noteValue
  }

  return {
    readAllSensors: function(my) {
      for(var sensorName in sensors) {
        var value = 0;
        var sensor = sensors[sensorName];

        if(!sensors.hasOwnProperty(sensorName)) continue
        if(sensors[sensorName].enabled) {
          val = readSensor(my[sensorName])
          if (val != null) {
            postSensorReading(sensor,val);
          }
        }
      }
    }
  }
}