var maps = {};

function StringMapper(mappings){
  if (typeof mappings === 'undefined') {
    maps = {};
  } else {
    maps = mappings;
  }
}

StringMapper.prototype.addMapping = function(initialWord, replacingWord, callback){
  maps[initialWord] = replacingWord;

  callback();
};

StringMapper.prototype.deleteMapping = function(mapping, callback) {
  delete maps[mapping];

  callback();
};

StringMapper.prototype.fullReset = function(callback){
  maps = {};

  callback();
};

StringMapper.prototype.parse = function(phrase, callback){
  var explodedPhrase = phrase.split(' ');

  for(i = 0; i < explodedPhrase.length; i++){
    var map = maps[explodedPhrase[i]];

    if(map){
      explodedPhrase[i] = map;
      i--;
    }
  }

  var reformedPhrase = explodedPhrase.join(' ');
  var phrase = reformedPhrase.charAt(0).toUpperCase() + reformedPhrase.slice(1);

  callback(phrase);
};

StringMapper.prototype.getMaps = function(callback){
  callback(maps);
}

module.exports = StringMapper;
