const { describe, it } = require('node:test');
const fs = require('fs');
const path = require('path');

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

function generateCSV(t, fn) {
  const str = [...csv(t)].join('');
  fn(null, str);
}

describe('furkot-driving-log node module', function () {

  it('simple trip', function (_t, done) {
    const t = require('./fixtures/simple-trip.json');
    const expected = readFileSync('fixtures/simple.csv');

    generateCSV(t, function (err, generated) {
      compareCsv(generated, expected);
      done(err);
    });
  });

  it('simple trip with adjusted speed', function (_t, done) {
    const t = require('./fixtures/speed-trip.json');
    const expected = readFileSync('fixtures/speed.csv');

    generateCSV(t, function (err, generated) {
      compareCsv(generated, expected);
      done(err);
    });
  });

  it('multi trip', function (_t, done) {
    const t = require('./fixtures/multi-trip.json');
    const expected = readFileSync('fixtures/multi.csv');

    generateCSV(t, function (err, generated) {
      compareCsv(generated, expected);
      done(err);
    });
  });

  it('begin end time', function (_t, done) {
    const t = require('./fixtures/time-trip.json');
    const expected = readFileSync('fixtures/time.csv');

    generateCSV(t, function (err, generated) {
      compareCsv(generated, expected);
      done(err);
    });
  });

  it('multi modal', function (_t, done) {
    const t = require('./fixtures/multi-modal-trip.json');
    const expected = readFileSync('fixtures/multi-modal.csv');

    generateCSV(t, function (err, generated) {
      compareCsv(generated, expected);
      done(err);
    });
  });

});
