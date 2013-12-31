var FibonacciHeap = require('../index').FibonacciHeap,
    Node = require('../index').Node;

suite('FibonacciHeap#deleteMin', function() {
  var subject, min;

  setup(function() {
    subject = new FibonacciHeap();
    subject.insert({ value: 0, priority: 0 });
    subject.insert({ value: 1, priority: 1 });
    subject.insert({ value: 2, priority: 2 });
    subject.insert({ value: 3, priority: 3 });
    subject.insert({ value: 4, priority: 4 });
    subject.insert({ value: 5, priority: 5 });
    min = subject.deleteMin();
  });

  test('should return the min', function() {
    assert.deepEqual(min, {
      children: [],
      value: 0,
      priority: 0
    });
  });

  test('should remove the min from the heap', function() {
    assert.ok(subject.every(function(node) {
      return node !== min;
    }));
    assert.equal(subject.size(), 5);
  });

  test('should update the min', function() {
    assert.deepEqual(subject._min.value, 1);
  });

  test('should consolidate same rank roots', function() {
    assert.equal(subject.trees(), 2);
    assert.equal(subject._min.rank(), 2);
  });
});
