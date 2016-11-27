// var recognition = new webkitSpeechRecognition();
// recognition.continuous = true;
// recognition.interimResults = true;
// recognition.onresult = function(event) {
//   console.log(event.results[0][0].transcript);
// }
//

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

var showInfo = function(info){
  $('#mood').empty();
  $('#mood').append('<p id="error">' + info + '</p>');
}

var informSuccess = function(){
  confirm();

  setTimeout(function(){
    sleep();
  }, 3000);

  acceptInstruction = false;
}

if (!('webkitSpeechRecognition' in window)) {
  showInfo('I\'m sorry but this app isn\'t supported on your browser');
} else {
  var final_transcript = "",
      recognition = new webkitSpeechRecognition();

  sleep();

  recognition.continuous = false;
  recognition.interimResults = true;

  recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
      showInfo('info_no_speech');
    }
    if (event.error == 'audio-capture') {
      showInfo('info_no_microphone');
    }
    if (event.error == 'not-allowed') {
      if (event.timeStamp - start_timestamp < 100) {
        showInfo('info_blocked');
      } else {
        showInfo('info_denied');
      }
    }
  };

  recognition.onresult = function(event) {
    var interim_transcript = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript = event.results[i][0].transcript;
        console.log('Decided! ' + final_transcript)
      } else {
        interim_transcript += event.results[i][0].transcript;
        console.log('Is it? ' + interim_transcript);
      }
    }

    switch (true) {
      case /ok box/.test(final_transcript):
        recognition.stop();
        notify();

        acceptInstruction = true;

        break;
      case /print [a-zA-Z0-9]*/.test(final_transcript):
        if(acceptInstruction){
          $.get('/print?word=' + final_transcript.split('print ')[1], function(){
            recognition.stop();
            informSuccess();
          })
        }
        break;
      case /map [a-zA-Z0-9]* to [a-zA-Z0-9]*/.test(final_transcript):
        if(acceptInstruction){
          var explodedPhrase = final_transcript.substring(4, final_transcript.length).split(' to ');

          $.get('/map?initialWord=' + explodedPhrase[0] + '&newWord=' + explodedPhrase[1], function(){
            recognition.stop();
            informSuccess();
          })
        }
        break;
      case /delete [a-zA-Z0-9]* to [a-zA-Z0-9]*/.test(final_transcript):
        if(acceptInstruction){
          var explodedPhrase = final_transcript.substring(4, final_transcript.length).split(' to ');

          $.ajax({
            url: '/map?initialWord=' + explodedPhrase[0],
            type: 'DELETE',
            success: function(result) {
              informSuccess();
            }
          });
        }
      break;
      case /reset mappings/.test(final_transcript):
        if(acceptInstruction){
          $.ajax({
            url: '/reset',
            type: 'DELETE',
            success: function(result) {
              informSuccess();
            }
          });
        }
        break;
      case /show mappings/.test(final_transcript):
        if(acceptInstruction){
          $.get('/list', function() {
            informSuccess();
          })
        }
        break;
      case /clear screen/.test(final_transcript):
        if(acceptInstruction){
          $.get('/clear', function(){
            recognition.stop();
            informSuccess();
          });
        }
        break;
    }

    recognition.onend = function() {
        recognition.start();
    };

  };

  recognition.start();
}
