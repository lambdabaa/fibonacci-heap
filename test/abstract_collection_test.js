var FibonacciHeap = require('../index').FibonacciHeap,
    Node = require('../index').Node;

suite('AbstractCollection', function() {
  var subject, members;

  setup(function() {
    members = [
      { one: 'fish' },
      { two: 'fish' },
      { red: 'fish' },
      { blue: 'fish' }
    ];

    subject = new FibonacciHeap();
    members.forEach(function(member) {
      subject.insert({ value: member, priority: 1 });
    });
  });

  suite('#any', function() {
    test('should return true if any', function() {
      assert.equal(subject.any(function(node) {
        return deepEqual(node.value, { one: 'fish' });
      }), true);
    });

    test('should return false if not any', function() {
      assert.equal(subject.any(function(node) {
        return deepEqual(node.value, { red: 'blue' });
      }), false);
    });
  });

  suite('#every', function() {
    test('should return true if every', function() {
      assert.equal(subject.every(function(node) {
        return true;
      }), true);
    });

    test('should return false if not every', function() {
      assert.equal(subject.every(function(node) {
        return deepEqual(node.value, { one: 'fish' });
      }), false);
    });
  });

  suite('#size', function() {
    test('should be correct', function() {
      assert.equal(subject.size(), members.length);
    });
  });
});
