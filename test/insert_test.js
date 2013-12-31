var FibonacciHeap = require('../index').FibonacciHeap,
    Node = require('../index').Node;

suite('FibonacciHeap#insert', function() {
  var subject, value;

  setup(function() {
    value = { sky: 'blue' };
    subject = new FibonacciHeap();
    subject.insert({ value: value, priority: 10 });
  });

  test('should contain inserted value', function() {
    assert.ok(subject.any(function(node) {
      return deepEqual(node.value, value);
    }));
  });

  test('should set the min', function() {
    assert.deepEqual(subject._min.value, value);
  });

  test('should update the min', function() {
    var other = { grass: 'green' };
    subject.insert({ value: other, priority: 1 });
    assert.deepEqual(subject._min.value, other);
  });
});
