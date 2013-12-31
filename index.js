var AbstractCollection = require('./lib/abstract_collection'),
    debug = require('debug')('FibonacciHeap'),
    deepEqual = require('deep-equal'),
    indexOf = require('./lib/array').indexOf,
    stringify = require('json-stable-stringify');

/**
 * @constructor
 */
function FibonacciHeap() {
  AbstractCollection.apply(this, arguments);
  this._valueToNode = {};
  this._rootList = [];
  this._mark = {};
}
module.exports.FibonacciHeap = FibonacciHeap;

FibonacciHeap.prototype = {
  __proto__: AbstractCollection.prototype,

  /**
   * @type {Node}
   * @private
   */
  _min: null,

  /**
   * @type {Object.<string, Node>}
   * @private
   */
  _valueToNode: null,

  /**
   * @type {Array.<Node>}
   * @private
   */
  _rootList: null,

  /**
   * @type {Object.<string, boolean>}
   * @private
   */
  _mark: null,

  /**
   * Add a value to the heap with some priority.
   *
   * heap.insert({ value: x, priority: 5 });
   *
   * @param {Object} options value and priority.
   */
  insert: function(options) {
    debug('create ' + JSON.stringify(options));
    var node = new Node();
    node.value = options.value;
    node.priority = options.priority;

    this._rootList.push(node);

    if (this._min === null || this._min.priority > node.priority) {
      debug('min ' + stringify(node.value));
      this._min = node;
    }

    // Cache the node for future lookups.
    var key = stringify(node.value);
    this._valueToNode[key] = node;

    this._mark[key] = false;
  },

  /**
   * Delete the min priority node from the heap.
   *
   * @return {Object} the element from the queue that has the highest priority.
   */
  deleteMin: function() {
    if (!this._min) {
      return;
    }

    debug('remove ' + stringify(this._min.value));
    var index = indexOf(this._rootList, function(node) {
      return deepEqual(node, this._min);
    }, this);
    this._rootList.splice(index, 1);

    // Remove the min node from the cache.
    var key = stringify(this._min.value);
    delete this._valueToNode[key];
    delete this._mark[key];

    // Meld children into root list.
    this._min.children.forEach(function(node) {
      debug('add ' + stringify(node.value) + ' to root list');
      this._rootList.push(node);
    }.bind(this));

    var min = this._min;
    this._min = null;
    this._rootList.forEach(function(node) {
      if (this._min === null || this._min.priority > node.priority) {
        this._min = node;
      }
    }.bind(this));
    debug('min ' + stringify(this._min && this._min.value));

    this._consolidate();

    return min;
  },

  /**
   * Update the priority of some queue value.
   *
   * heap.update({ value: x, priority: 100 });
   *
   * @param {Object} options value and priority.
   */
  update: function(options) {
    debug('update ' + stringify(options));

    var value = options.value;
    var priority = options.priority;
    var key = stringify(value);
    var node = this._valueToNode[key];
    node.priority = priority;

    // If it doesn't violate heap-ordering, just update priority.
    if (!node.parent || node.parent.priority <= node.priority) {
      if (node.priority < this._min.priority) {
        this._min = node;
      }

      return;
    }

    while (true) {
      var parent = node.parent;

      // Cut the child from its parent.
      debug('cut ' + stringify(node.value) +
            ' from ' + stringify(parent.value));
      parent.removeChild(node);
      node.parent = null;
      this._rootList.push(node);
      var key = stringify(node.value);
      this._mark[key] = false;

      // If the parent is a root, we're done.
      if (!parent.parent) {
        break;
      }

      // If parent is unmarked, mark it.
      var parentKey = stringify(parent.value);
      if (!this._mark[parentKey]) {
        this._mark[parentKey] = true;
        break;
      }

      // If parent is marked, recurse.
      node = parent;
    }
  },

  trees: function() {
    return this._rootList.length;
  },

  /**
   * Invoke a function on each node.
   *
   * @param {Function} callback to invoke.
   */
  forEach: function(callback) {
    for (var i = 0; i < this._rootList.length; i++) {
      var node = this._rootList[i];
      node.iterate(function(next) {
        callback(next);
      });
    }
  },

  /**
   * Consolidate trees so that no two roots have the same rank.
   */
  _consolidate: function() {
    var rankToTree = {};
    for (var i = 0; i < this._rootList.length;) {
      var node = this._rootList[i];
      var rank = node.rank();

      // If we haven't yet found a tree that shares
      // a rank with this one, record it and continue.
      if (!(rank in rankToTree)) {
        rankToTree[rank] = node;
        i++;
        continue;
      }


      // Link root with other since they have the same rank.
      var other = rankToTree[rank];
      var smaller, larger;
      if (node.priority < other.priority) {
        smaller = node;
        larger = other;
      } else {
        smaller = other;
        larger = node;
      }

      delete rankToTree[rank];

      // Remove both nodes from the root list.
      var smallerIndex = indexOf(this._rootList, function(node) {
        return deepEqual(node, smaller);
      });
      this._rootList.splice(smallerIndex, 1);
      var largerIndex = indexOf(this._rootList, function(node) {
        return deepEqual(node, larger);
      });
      this._rootList.splice(largerIndex, 1);

      // Make the larger one point to the smaller one.
      smaller.children.push(larger);
      larger.parent = smaller;

      // Add the smaller one back into the root list.
      this._rootList.push(smaller);
      i--;
    }
  }
};

/**
 * @constructor
 */
function Node() {
  this.children = [];
}
module.exports.Node = Node;

Node.prototype = {
  /**
   * Apply some function to each node in the subtree
   * rooted at us.
   *
   * @param {Function} callback to invoke.
   */
  iterate: function(callback) {
    callback(this);
    this.children.forEach(function(childNode) {
      childNode.iterate(callback);
    });
  },

  /**
   * @return {number} number of children.
   */
  rank: function() {
    return this.children.length;
  },

  /**
   * @param {Node} childNode some node.
   */
  removeChild: function(childNode) {
    var index = indexOf(this.children, function(node) {
      return deepEqual(node, childNode);
    });
    this.children.splice(index, 1);
  },

  /**
   * @type {Array.<Node>}
   */
  children: null,

  /**
   * @type {Node}
   */
  parent: null,

  /**
   * @type {number}
   */
  priority: Infinity,

  /**
   * @type {Object}
   */
  value: null
};
