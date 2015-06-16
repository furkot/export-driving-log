var durations = [ 60 * 60, 60 ];
var periods_abbr = [ 'h', 'm' ];


function pad(n) {
  return n < 10 ? '0' + n : n;
}

/**
 * Human-readable string for duration
 * @param {Number} dur duration in milliseconds to print
 * @param {Boolean} abbr <code>true</code> to abbreviate units
 */
function duration(dur) {
  var str = '';
  durations.forEach(function(d, i) {
    var num = Math.floor(dur / d);
    if (num) {
      dur -= num * d;
      if (str) {
        str += ' ';
      }
      str += String(num) + periods_abbr[i];
    }
  });
  return str;
}

function distance(dist, precision, units) {
  var div = units === 'km' ? 1000 : 1609.344;
  precision = precision || 0;
  return (dist / div).toFixed(precision);
}

function date(d) {
  return [d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate()].map(pad).join('-');
}

function time(d) {
  return [d.getUTCHours(), d.getUTCMinutes()].map(pad).join(':');
}

module.exports = {
  duration: duration,
  distance: distance,
  date: date,
  time: time
};
