var fs = require('fs');
var path = require('path');
var WritableStreamBuffer = require('stream-buffers').WritableStreamBuffer;

var csv = require('..');

/**
 * Compare files line-by-line
 */
function compareCsv(actual, expected) {
  var a = actual.split('\n');
  var e = expected.split('\n');
  a.should.have.length(e.length);
  a.forEach(function(line, index) {
    line.should.eql(e[index]);
  });
}

function readFileSync(name) {
  return fs.readFileSync(path.join(__dirname, name), 'utf8');
}

function generateCSV(t, fn) {
  var ostream = new WritableStreamBuffer();
  csv(ostream, t);
  ostream
  .on('error', fn)
  .on('finish', function() {
    fn(null, ostream.getContentsAsString('utf8'));
  });
}

describe('furkot-driving-log node module', function () {

  it('simple trip', function(done) {
    var t = require('./fixtures/simple-trip.json'),
      expected = readFileSync('fixtures/simple.csv');

    generateCSV(t, function(err, generated) {
      compareCsv(generated, expected);
      done(err);
    });
  });

  it('simple trip with adjusted speed', function(done) {
    var t = require('./fixtures/speed-trip.json'),
      expected = readFileSync('fixtures/speed.csv');

    generateCSV(t, function(err, generated) {
      compareCsv(generated, expected);
      done(err);
    });
  });

  it('multi trip', function(done) {
    var t = require('./fixtures/multi-trip.json'),
      expected = readFileSync('fixtures/multi.csv');

    generateCSV(t, function(err, generated) {
      compareCsv(generated, expected);
      done(err);
    });
  });

  it('begin end time', function(done) {
    var t = require('./fixtures/time-trip.json'),
      expected = readFileSync('fixtures/time.csv');

    generateCSV(t, function(err, generated) {
      compareCsv(generated, expected);
      done(err);
    });
  });

  it('multi modal', function(done) {
    var t = require('./fixtures/multi-modal-trip.json'),
      expected = readFileSync('fixtures/multi-modal.csv');

    generateCSV(t, function(err, generated) {
      compareCsv(generated, expected);
      done(err);
    });
  });

});
