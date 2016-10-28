var five = require("johnny-five");
var Photon = require("particle-io");
var lcd;

var board = new five.Board({
  io: new Photon({
    token: '45726cadd76e63b70a9454ca39a4eddc174b87f3',
    deviceId: '2d0033000447343339373536'
  })
});

board.on("ready", function() {
	lcd = new five.LCD({
    pins: ["D0", "D1", "D2", "D3", "D4", "D5"],
    rows: 2,
    cols: 16
  });

  lcd.clear();
});

var LCD = {
  sendToLCD: function(word){
    lcd.clear();
    lcd.print(word);
  },

  clearScreen: function(){
    lcd.clear();
  },

  displayMappings: function(maps){
    var count = 0;

    (function showMap(){
      setTimeout(function(){
        console.log(maps[count]);
      }, 2000);

      if(count <= maps.length){
        count++;
        showMap();
      }
    })()
  }
}

module.exports = LCD;
