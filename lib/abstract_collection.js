function AbstractCollection() {
}
module.exports = AbstractCollection;

AbstractCollection.prototype = {
  /**
   * Test whether heap contains a node that makes the callback pass.
   *
   * @param {Function} callback to test on each node.
   */
  any: function(callback) {
    var result = false;
    this.forEach(function(node) {
      if (callback(node)) {
        result = true;
      }
    });

    return result;
  },

  /**
   * Test whether every heap node passes callback test.
   *
   * @param {Function} callback to test on each node.
   */
  every: function(callback) {
    var result = true;
    this.forEach(function(node) {
      if (!callback(node)) {
        result = false;
      }
    });

    return result;
  },

  /**
   * @return {number} the number of members in the collection.
   */
  size: function() {
    var count = 0;
    this.forEach(function(node) {
      count += 1;
    });

    return count;
  },

  /**
   * Specific collections should implement forEach!
   */
  forEach: function(callback) {
  }
};
