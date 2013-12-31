var array = {
  indexOf: function(array, callback, thisObject) {
    var result = -1;
    array.some(function(value, index) {
      if (callback.call(thisObject, value)) {
        result = index;
        return true;
      }
    });

    return result;
  }
};
module.exports = array;
