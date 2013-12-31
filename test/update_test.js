var FibonacciHeap = require('../index').FibonacciHeap,
    Node = require('../index').Node,
    stringify = require('json-stable-stringify');

suite('FibonacciHeap#update', function() {
  var subject;

  setup(function() {
    subject = new FibonacciHeap();
    subject.insert({ value: 0, priority: 0 });
    subject.insert({ value: 1, priority: 1 });
    subject.insert({ value: 2, priority: 2 });
    subject.insert({ value: 3, priority: 3 });
    subject.insert({ value: 4, priority: 4 });
    subject.insert({ value: 5, priority: 5 });
    subject.deleteMin();
    /**
     * -----1-----5-----
     * ---2---3---------
     * --------4--------
     */
  });

  test('should just decrease priority', function() {
    subject.update({ value: 3, priority: 2 });
    assert.equal(subject.every(function(node) {
      switch (node.value) {
        case 1:
          return node.priority === 1 &&
                 node.parent === null &&
                 node.rank() === 2;
        case 2:
          return node.priority === 2 &&
                 node.parent.value === 1 &&
                 node.rank() === 0;
        case 3:
          return node.priority === 2 &&
                 node.parent.value === 1 &&
                 node.rank() === 1;
        case 4:
          return node.priority === 4 &&
                 node.parent.value === 3 &&
                 node.rank() === 0;
        case 5:
          return node.priority === 5 &&
                 node.parent === null &&
                 node.rank() === 0;
        default:
          return false;
      }
    }), true);
  });

  test('should update min if necessary', function() {
    subject.update({ value: 5, priority: 0 });
    assert.equal(subject._min.value, 5);
  });

  test('should cut child if necessary', function() {
    subject.update({ value: 4, priority: 0 });
    assert.equal(subject.any(function(node) {
      if (node.value !== 4) {
        return false;
      }

      return node.parent === null;
    }), true);
  });

  test('should mark parent when child cut', function() {
    subject.update({ value: 4, priority: 0 });
    assert.equal(subject.any(function(node) {
      if (node.value !== 3) {
        return false;
      }

      var key = stringify(node.value);
      return subject._mark[key];
    }), true);
  });

  test('should cut parent when marked', function() {
    var key = stringify(3);
    subject._mark[key] = true;
    subject.update({ value: 4, priority: 0 });
    assert.equal(subject.any(function(node) {
      if (node.value !== 3) {
        return false;
      }

      return node.parent === null;
    }), true);
  });

  test('should not mark node in root list', function() {
    var key = stringify(3);
    subject._mark[key] = true;
    subject.update({ value: 4, priority: 0 });
    assert.equal(subject.any(function(node) {
      if (node.value !== 1) {
        return false;
      }

      var key = stringify(node.value);
      return subject._mark[key];
    }), false);
  });
});
