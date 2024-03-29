const format = require('./format');

exports = module.exports = drivingLog;
exports.contentType = 'text/csv';
exports.extension = 'csv';
exports.encoding = 'utf8';

const zero = {
  distance: 0,
  driving: 0
};

function prepare(line) {
  return line.map(function (item) {
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
  ['arrival_time', 'departure_time'].forEach(
    time => step[time] = new Date(step[time])
  );
}

function* drivingLog(options) {
  const distanceUnit = options.metadata && options.metadata.units;

  const totals = {
    driving: 0,
    distance: 0
  };

  const header = [
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

  const mode = options.metadata && options.metadata.mode;

  const steps = options.routes[0].points;

  function getLine(i) {
    const step = steps[i];
    const next = steps[i + 1];

    if (i === 0) {
      updateDates(step);
    }
    updateDates(next);

    let travel;
    if (mode === next.mode || next.mode === undefined) {
      travel = next;
    } else {
      travel = zero;
    }

    totals.driving += travel.driving;
    totals.distance += travel.distance;

    const line = [];

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

  yield prepare(header);
  for (let i = 0; i < steps.length - 1; i++) {
    yield getLine(i);
  }
}
