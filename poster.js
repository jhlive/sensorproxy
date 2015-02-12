var rest = require('restler')
var server = require('./config/ensembleserver')

//add a note to a composition
var postNote = function(note,cb) {
  rest.post(server.url + server.notes, {
    data: note
  }).on('complete',function(data,response) {
    if(data.code == 'ENOTFOUND') {
      return cb("couldn't connect to server",null)
    }
    if(response.statusCode == 200) {
      return cb(null,data)
    } else {
      return cb(response,data)
    }
  })
}

//create a new composition
var postComposition = function(composition,cb) {
  rest.post(server.url + server.compositions, {
    data: composition
  }).on('complete',function(data,response) {
    if(data.code == 'ENOTFOUND') {
      return cb("couldn't connect to server",null)
    }

    if(response.statusCode == 200) {
      // console.log('data: ', data)
      return cb(null,data)
    } else {
      return cb(response,data)
    }
  })
}

//update a composition with id
var putComopsition = function(id,composition,cb){
  rest.post(server.url + server.compositions + '/ + id', {
    data:composition
  }).on('complete',function(data,response) {
    if(data.code == 'ENOTFOUND') {
      return cb("couldn't connect to server",null)
    }
    if(response.statusCode == 200) {
      return(cb(null,data))
    } else {
      return cb(response,data)
    }
  })
}

module.exports.postComposition = postComposition
module.exports.postNote = postNote
