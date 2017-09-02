var Readable = require('stream').Readable;
var format = require('./format');

exports = module.exports = drivingLog;
exports.contentType = 'text/csv';
exports.extension = 'csv';

var zero = {
  distance: 0,
  driving: 0
};

function prepare(line) {
  return line.map(function(item) {
    if (typeof item === 'number') {
      return '' + item;
    }
    if (typeof item === 'string') {
      // quote strings
      return '"' + item.replace(/"/g, '""') + '"';
    }
    // empty string for everything else
    return '';
  }).join(',') + '\n';
}

function updateDates(step) {
  ['arrival_time', 'departure_time'].forEach(function(time) {
    step[time] = new Date(step[time]);
  });
}

function drivingLog(out, options) {
  var distanceUnit = options.metadata && options.metadata.units,
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
    ],
    mode = options.metadata && options.metadata.mode;

  var steps = options.routes[0].points;

  function getLine(i) {
    if (i < 0) {
      return prepare(header);
    }

    var step = steps[i];
    var next = steps[i + 1];

    if (!next) {
      return;
    }

    if (i === 0) {
      updateDates(step);
    }
    updateDates(next);

    var travel;
    if (mode === next.mode || next.mode === undefined) {
        travel = next;
    }
    else {
        travel = zero;
    }

    totals.driving += travel.driving;
    totals.distance += travel.distance;

    var line = [];

    line.push(step.name);
    line.push(step.address);
    line.push(next.name);
    line.push(next.address);
    line.push(format.date(step.departure_time));
    line.push(format.time(step.departure_time));
    line.push(format.date(next.arrival_time));
    line.push(format.time(next.arrival_time));
    line.push(format.duration(travel.driving));
    line.push(format.distance(travel.distance, 1, distanceUnit));
    line.push(format.duration(totals.driving));
    line.push(format.distance(totals.distance, 1, distanceUnit));
    line.push(step.notes);

    return prepare(line);
  }


  var maxLine = steps.length - 1;
  var currentLine = -1;

  var stream = new Readable({
    read: function read() {
      while (currentLine < maxLine) {
        if (!this.push(getLine(currentLine++))) {
          break;
        }
      }
      if (currentLine >= maxLine) {
        this.push(null);
      }
    }
  });

  stream.pipe(out);
}
