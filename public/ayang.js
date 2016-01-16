if (annyang) {
  annyang.addCommands({
    'light *status': function(name) {
      switch(name){
        case "off":
          $.get('/off');
          break;
        case "on":
          $.get('/on');
          break;
      }
    },
    'go *color': function(color){
      $.get('/color?choice=' + color)
    }
  });

  annyang.start();
}