global.assert = require('assert');
global.deepEqual = require('deep-equal');

global.timeSync = function(test) {
  var start = new Date().getTime();
  test();
  var finish = new Date().getTime();
  return finish - start;
};
