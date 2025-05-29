import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import csv from '../lib/driving-log.js';

/**
 * Compare files line-by-line
 */
function compareCsv(actual, expected) {
  const a = actual.split('\n');
  const e = expected.split('\n');
  assert.equal(a.length, e.length);
  a.forEach((line, index) => {
    assert.equal(line, e[index]);
  });
}

function readFileSync(name) {
  return fs.readFileSync(path.join(import.meta.dirname, name), 'utf8');
}

function readJSON(name) {
  return JSON.parse(readFileSync(name));
}

function generateCSV(t) {
  return Array.from(csv(t)).join('');
}

test('simple trip', () => {
  const data = readJSON('./fixtures/simple-trip.json');
  const expected = readFileSync('fixtures/simple.csv');

  const generated = generateCSV(data);
  compareCsv(generated, expected);
});

test('simple trip with adjusted speed', () => {
  const data = readJSON('./fixtures/speed-trip.json');
  const expected = readFileSync('fixtures/speed.csv');

  const generated = generateCSV(data);
  compareCsv(generated, expected);
});

test('multi trip', () => {
  const data = readJSON('./fixtures/multi-trip.json');
  const expected = readFileSync('fixtures/multi.csv');

  const generated = generateCSV(data);
  compareCsv(generated, expected);
});

test('begin end time', () => {
  const data = readJSON('./fixtures/time-trip.json');
  const expected = readFileSync('fixtures/time.csv');

  const generated = generateCSV(data);
  compareCsv(generated, expected);
});

test('multi modal', () => {
  const data = readJSON('./fixtures/multi-modal-trip.json');
  const expected = readFileSync('fixtures/multi-modal.csv');

  const generated = generateCSV(data);
  compareCsv(generated, expected);
});
