const { describe, it } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const csv = require('..');

/**
 * Compare files line-by-line
 */
function compareCsv(actual, expected) {
  const a = actual.split('\n');
  const e = expected.split('\n');
  a.should.have.length(e.length);
  a.forEach(function (line, index) {
    line.should.eql(e[index]);
  });
}

function readFileSync(name) {
  return fs.readFileSync(path.join(__dirname, name), 'utf8');
}

function generateCSV(t) {
  return Array.from(csv(t)).join('');
}

describe('furkot-driving-log node module', function () {

  it('simple trip', function () {
    const t = require('./fixtures/simple-trip.json');
    const expected = readFileSync('fixtures/simple.csv');

    const generated = generateCSV(t);
    compareCsv(generated, expected);
  });

  it('simple trip with adjusted speed', function () {
    const t = require('./fixtures/speed-trip.json');
    const expected = readFileSync('fixtures/speed.csv');

    const generated = generateCSV(t);
    compareCsv(generated, expected);
  });

  it('multi trip', function () {
    const t = require('./fixtures/multi-trip.json');
    const expected = readFileSync('fixtures/multi.csv');

    const generated = generateCSV(t);
    compareCsv(generated, expected);
  });

  it('begin end time', function () {
    const t = require('./fixtures/time-trip.json');
    const expected = readFileSync('fixtures/time.csv');

    const generated = generateCSV(t);
    compareCsv(generated, expected);
  });

  it('multi modal', function () {
    const t = require('./fixtures/multi-modal-trip.json');
    const expected = readFileSync('fixtures/multi-modal.csv');

    const generated = generateCSV(t);
    compareCsv(generated, expected);
  });
});
