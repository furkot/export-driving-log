import { date, distance, duration, time } from './format.js';

drivingLog.contentType = 'text/csv';
drivingLog.extension = 'csv';
drivingLog.encoding = 'utf8';

const zero = {
  distance: 0,
  driving: 0
};

function prepare(line) {
  const items = line.map(item => {
    switch (typeof item) {
      case 'number':
        return item.toString();
      case 'string':
        // quote strings
        return `"${item.replace(/"/g, '""')}"`;
      default:
        // empty string for everything else
        return '';
    }
  });
  return `${items.join(',')}\n`;
}

function updateDates(step) {
  ['arrival_time', 'departure_time'].forEach(time => (step[time] = new Date(step[time])));
}

export default function* drivingLog(options) {
  const distanceUnit = options.metadata?.units;

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

  const mode = options.metadata?.mode;

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
    line.push(date(step.departure_time));
    line.push(time(step.departure_time));
    line.push(date(next.arrival_time));
    line.push(time(next.arrival_time));
    line.push(duration(travel.driving));
    line.push(distance(travel.distance, 1, distanceUnit));
    line.push(duration(totals.driving));
    line.push(distance(totals.distance, 1, distanceUnit));
    line.push(step.notes);

    return prepare(line);
  }

  yield prepare(header);
  for (let i = 0; i < steps.length - 1; i++) {
    yield getLine(i);
  }
}
