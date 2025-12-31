import { cost, date, distance, duration, time } from './format.js';

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

function calcCost(distance, rate, units) {
  if (!rate) {
    return 0;
  }
  // distance is in meters, rate is in cents per mile or per kilometer
  const div = units === 'km' ? 100000 : 160934.4;
  return (distance / div) * rate;
}

export default function* drivingLog(options) {
  const distanceUnit = options.metadata?.units;
  const currency = options.metadata?.currency;
  const mileageRate = options.metadata?.mileageRate;

  const totals = {
    driving: 0,
    distance: 0,
    cost: 0
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
    mileageRate && 'Cost',
    'Total Driving Time',
    'Total Distance',
    mileageRate && 'Total Cost',
    'Notes'
  ].filter(Boolean);

  const mode = options.metadata?.mode;

  const steps = options.routes[0].points;
  let passthruTravel = { ...zero };

  function getLine(i) {
    const step = passthruTravel.step ?? steps[i];
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

    if (travel.passthru) {
      passthruTravel.step ??= step;
      passthruTravel.distance += travel.distance;
      passthruTravel.driving += travel.driving;
      return '';
    }
    if (passthruTravel.distance || passthruTravel.driving) {
      travel.distance += passthruTravel.distance;
      travel.driving += passthruTravel.driving;
      passthruTravel = { ...zero };
    }

    const travelCost = calcCost(travel.distance, mileageRate, distanceUnit);

    totals.driving += travel.driving;
    totals.distance += travel.distance;
    totals.cost += travelCost;

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
    if (mileageRate) {
      line.push(cost(travelCost, currency));
    }
    line.push(duration(totals.driving));
    line.push(distance(totals.distance, 1, distanceUnit));
    if (mileageRate) {
      line.push(cost(totals.cost, currency));
    }
    line.push(step.notes);

    return prepare(line);
  }

  yield prepare(header);
  for (let i = 0; i < steps.length - 1; i++) {
    yield getLine(i);
  }
}
