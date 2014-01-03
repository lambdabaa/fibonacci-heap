var FibonacciHeap = require('../../index').FibonacciHeap;

suite('FibonacciHeap#deleteMin perf', function() {
  var subject;

  test('should be O(log(n))', function() {
    subject = new FibonacciHeap();
    for (var i = 0; i < 1000; i++) {
      subject.insert({ value: i, priority: i });
    }
    var small = timeSync(function() {
      for (var i = 0; i < 1000; i++) {
        subject.deleteMin();
      }
    });

    subject = new FibonacciHeap();
    for (var i = 0; i < 10000; i++) {
      subject.insert({ value: i, priority: i });
    }
    var large = timeSync(function() {
      for (var i = 0; i < 10000; i++) {
        subject.deleteMin();
      }
    });

    var upperBound = small * 100;
    var actual = large;
    assert.ok(upperBound > actual);
  });
});
