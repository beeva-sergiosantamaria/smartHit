// Retrieve
'use strict'
var express = require("express");  
var bodyParser  = require("body-parser");
var mongoose = require('mongoose');
var methodOverride = require("method-override");
var app = express();
//var voiceFile = require('./polly-tts/tts');

mongoose.connect('mongodb://localhost/smartHit', function(err, res) {  
  if(err) {
    console.log('ERROR: connecting to Database. ' + err);
  }
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.urlencoded({ extended: false }));  
app.use(bodyParser.json());  
app.use(methodOverride());

var faceModel	= require('./models/faceCollectionMod')(app, mongoose);  
var faceCtrl 	= require('./controllers/faceCollectionCtrl');

var faces = express.Router();

faces.route('/faceCollection')
	.get(faceCtrl.findAllFaces)
	.post(faceCtrl.addFaces)
  	.delete(faceCtrl.deleteFaces);

app.use('/faces', faces);
 
app.listen(3000, function() {
	console.log("Node server running on http://localhost:3000");
});

var sockerServer = require('http').Server(app);
var io = require('socket.io')(sockerServer);

sockerServer.listen(3031, function() {
  console.log("websocket server running on http://localhost:3031");
});

io.on('connection', function(socket){
  console.log('alguien se ha conectado con socket.')
  socket.emit('messages', {
    id: 1,
    text: "Hola soy un mensaje",
    author: "Carlos Zaratustre"
  })
  socket.on('messagesReturn', function(data){
    console.log(data);
  })
})

var net = require('net-socket');
 
var socket = net.connect(7777, 'localhost');
 
socket.setEncoding('utf8');
socket.on('connect', function () {
    // connected 
    
    socket.end('hey');
    socket.destroy();
});


