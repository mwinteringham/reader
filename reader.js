var https = require('https');
var fs = require('fs');
var express = require('express');
var five = require("johnny-five");
var Photon = require("particle-io");
var led;
var rgbLed;

var board = new five.Board({
  io: new Photon({
    token: '',
    deviceId: ''
  })
});

var options = {
  key: fs.readFileSync('/usr/local/apache/conf/server.key'),
  cert: fs.readFileSync('/usr/local/apache/conf/server.crt'),
  requestCert: false,
  rejectUnauthorized: false
};

var app = express();
app.use(express.static('public'));

var html = "<html><head><script src='//cdnjs.cloudflare.com/ajax/libs/annyang/2.1.0/annyang.min.js'></script>" +
  "<script src='//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js'></script>" +
  "<script src='ayang.js'></script></head><body><h1>ANNYANG!</h1><div class='hello'></div></html>"

app.get('/', function(req, res){
  res.send(html);
});

app.get('/on', function(req, res){
  rgbLed.on();

  res.sendStatus(200);
});

app.get('/off', function(req, res){
  rgbLed.off();

  res.sendStatus(200);
})

var colors = {
	"red": "#00FFFF",
	"green": "FF00FF",
	"blue": "#FFFF00"
}

app.get('/color', function(req, res){
	rgbLed.on();
  rgbLed.color(colors[req.query.choice]);

	res.sendStatus(200);
})

board.on("ready", function() {
	led = new five.Led("D7");
	rgbLed = new five.Led.RGB({pins: {
      red: 'A4',
      green: 'A5',
      blue: 'A6'
    }});

  var server = https.createServer(options, app).listen(3000, function(){
    console.log("server started at port 3000");
  });
});