/**
 * Simple string buffer.
 */
function buffer() {
  var self, my = {
    strs: []
  };

  self = {
    toString: function () {
      return my.strs.join('');
    },

    write: function () {
      my.strs.push(Array.prototype.join.call(arguments, ''));
      return self;
    },

    writeln: function () {
      my.strs.push(Array.prototype.join.call(arguments, '') + '\n');
      return self;
    }
  };

  return self;
}

module.exports = buffer;