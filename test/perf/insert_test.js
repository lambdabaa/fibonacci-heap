var FibonacciHeap = require('../../index').FibonacciHeap;

suite('FibonacciHeap#insert perf', function() {
  var subject;

  test('should be O(1)', function() {
    subject = new FibonacciHeap();
    var small = timeSync(function() {
      for (var i = 0; i < 5000; i++) {
        subject.insert({ value: i, priority: i });
      }
    });

    subject = new FibonacciHeap();
    var large = timeSync(function() {
      for (var i = 0; i < 50000; i++) {
        subject.insert({ value: i, priority: i });
      }
    });

    var expected = small * 10;
    var actual = large;
    var difference = Math.abs(expected - actual) / expected;
    assert.ok(difference <= 1, 'difference ' + difference);
  });
});

