var acceptInstruction = false;

var sleep = function(){
  $('#mood').empty();
  $("#mood").append('<p>🙂</p>');
}

var notify = function(){
  $('#mood').empty();
  $('#mood').append('<p>🤔</p>');
}

var confirm = function(){
  $('#mood').empty();
  $('#mood').append('<p>😌</p>');
  $('#mood p').append('<p id="overlay">👌</p>');
}

var informSuccess = function(){
  confirm();

  setTimeout(function(){
    sleep();
  }, 3000);

  acceptInstruction = false;
}

$(document).ready(function(){
  sleep();

  if (annyang) {
    annyang.addCommands({
      '*ok box*': function(){
          notify();

          acceptInstruction = true;
      },
      'print *word': function(word){
        if(acceptInstruction){
          $.get('/print?word=' + word, function(){
            informSuccess();
          })
        }
      },
      'map *oldword to *newword': function(oldWord, newWord){
        if(acceptInstruction){
          $.get('/map?initialWord=' + oldWord + '&newWord=' + newWord, function(){
            informSuccess();
          })
        }
      },
      'delete *oldword to *newword': function(oldWord){
        if(acceptInstruction){
          $.ajax({
            url: '/map?initialWord=' + oldWord,
            type: 'DELETE',
            success: function(result) {
              informSuccess();
            }
          });
        }
      },
      'reset mappings': function(){
        if(acceptInstruction){
          $.ajax({
            url: '/reset',
            type: 'DELETE',
            success: function(result) {
              informSuccess();
            }
          });
        }
      },
      'clear screen': function() {
        if(acceptInstruction){
          $.get('/clear', function(){
            informSuccess();
          });
        }
      },
      'list mappings': function() {
        if(acceptInstruction){
          $.get('/list', function() {
            informSuccess();
          })
        }
      }
    });

    annyang.debug();
    annyang.start();
  }

})
