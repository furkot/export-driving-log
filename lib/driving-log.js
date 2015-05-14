var buffer = require('./buffer');
var format = require('./format');

exports = module.exports = drivingLog;
exports.contentType = 'text/csv';
exports.extension = 'csv';

function write(out, line) {
  line = line.map(function(item) {
    if(typeof item === 'number') {
      return '' + item;
    }
    if(typeof item === 'string') {
      // quote strings
      return '"' + item.replace(/"/g, '""') + '"';
    }
    // empty string for everything else
    return '';
  }).join(',');
  out.write(line + '\n');
}

function updateDates(step) {
  ['arrival_time', 'departure_time'].forEach(function(time) {
    step[time] = new Date(step[time]);
  });
}


function drivingLog(options) {
  var out = buffer(),
    distanceUnit = options.metadata && options.metadata.units,
    totals = {
      driving: 0,
      distance: 0
    },
    header = [
      'From',
      'From Address',
      'To',
      'To Address',
      'Departure Date',
      'Departure Time',
      'Arrival Date',
      'Arrival Time',
      'Driving Time',
      'Distance',
      'Total Driving Time',
      'Total Distance',
      'Notes'
    ];


  write(out, header);

  options.routes[0].points.forEach(function (step, i, steps) {
    var line = [], next = steps[i + 1];
    if (!next) {
      return;
    }

    if (i === 0) {
      updateDates(step);
    }
    updateDates(next);

    totals.driving += next.driving;
    totals.distance += next.distance;

    line.push(step.name);
    line.push(step.address);
    line.push(next.name);
    line.push(next.address);
    line.push(format.date(step.departure_time));
    line.push(format.time(step.departure_time));
    line.push(format.date(next.arrival_time));
    line.push(format.time(next.arrival_time));
    line.push(format.duration(next.driving));
    line.push(format.distance(next.distance, 1, distanceUnit));
    line.push(format.duration(totals.driving));
    line.push(format.distance(totals.distance, 1, distanceUnit));
    line.push(step.notes);

    write(out, line);
  });
  return out.toString();
}
