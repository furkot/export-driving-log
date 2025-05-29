const durations = [60 * 60, 60];
const periods_abbr = ['h', 'm'];

function pad(n) {
  return n < 10 ? `0${n}` : n;
}

/**
 * Human-readable string for duration
 * @param {Number} dur duration in milliseconds to print
 * @param {Boolean} abbr <code>true</code> to abbreviate units
 */
export function duration(dur) {
  let str = '';
  durations.forEach((d, i) => {
    const num = Math.floor(dur / d);
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

export function distance(dist, precision, units) {
  const div = units === 'km' ? 1000 : 1609.344;
  precision = precision || 0;
  return (dist / div).toFixed(precision);
}

export function date(d) {
  return [d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate()].map(pad).join('-');
}

export function time(d) {
  return [d.getUTCHours(), d.getUTCMinutes()].map(pad).join(':');
}
