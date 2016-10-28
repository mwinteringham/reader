var https = require('https'),
    fs = require('fs'),
    express = require('express'),
    lcd = require('./src/lcd'),
    StringMapper = require('./src/stringmapper'),
    options = {
      key: fs.readFileSync('/usr/local/apache/conf/server.key'),
      cert: fs.readFileSync('/usr/local/apache/conf/server.crt'),
      requestCert: false,
      rejectUnauthorized: false
    },
    sm;

var app = express();
app.use(express.static('static'));

app.get('/print', function(req, res){
  sm.parse(req.query.word, function(payload) {
    lcd.sendToLCD(payload);

    res.sendStatus(201);
  });
});

app.get('/map', function(req, res){
  sm.addMapping(req.query.initialWord, req.query.newWord, function() {
    res.sendStatus(201);
  });
});

app.get('/clear', function(req, res){
  lcd.clearScreen();

  res.sendStatus(201);
});

app.get('/list', function(req, res){
  sm.getMaps(function(maps){
    lcd.displayMappings(maps);
  });

  res.sendStatus(201);
});

app.delete('/map', function(req, res){
  sm.deleteMapping(req.query.initialWord, function(){
    res.sendStatus(201);
  });
});

app.delete('/reset', function(req, res){
  sm.fullReset(function() {
    res.sendStatus(201);
  });
});

var server = https.createServer(options, app).listen(3000, function(){
  sm = new StringMapper();
  console.log("server started at port 3000");
});
