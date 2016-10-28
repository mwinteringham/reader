var assert = require('assert');
var StringMapper = require('../src/stringmapper');

describe('String mapper', function() {

  it('should allow me to reset all mappings', function(){
    var sm = new StringMapper({
      'apple': 'orange'
    });

    sm.fullReset(function(){
      sm.parse('i would like an apple', function(result){
        assert.equal(result, 'I would like an apple');
      });
    });
  });

  it('should allow me to create a word map', function(){
    var sm = new StringMapper();
    sm.addMapping('apple','orange', function(){
      sm.parse('i would like an apple', function(result) {
        assert.equal(result, 'I would like an orange');
      });
    });
  });

  it('should allow me to map multiple words', function(){
    var sm = new StringMapper();
    sm.addMapping('apple','orange', function(){
      sm.addMapping('orange','plum', function(){
        sm.parse('i would like a apple', function(result){
          assert.equal(result, 'I would like a plum');
        });
      });
    });
  });

  it('should allow me to edit a mapping', function() {
    var sm = new StringMapper();
    sm.addMapping('apple','orange', function(){
      sm.addMapping('apple','plum', function() {
        sm.parse('i would like a apple', function(result){
          assert.equal(result, 'I would like a plum');
        });
      });
    });
  });

  it('should let me delete a specific map', function(){
    var sm = new StringMapper({
      'apple': 'orange'
    });

    sm.deleteMapping('apple', function(){
      sm.parse('i would like an apple', function(result){
        assert.equal(result, 'I would like an apple');
      });
    });
  });

  it('should let me return the map', function(){
    var sm = new StringMapper({
      'apple': 'orange',
      'pear': 'plum'
    });

    sm.getMaps(function(maps) {
      assert.deepEqual(maps, {
        'apple': 'orange',
        'pear': 'plum'
      });
    });
  })

});
