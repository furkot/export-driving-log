[![NPM version][npm-image]][npm-url]
[![Build Status][build-image]][build-url]
[![Dependency Status][deps-image]][deps-url]

# furkot-driving-log

Generate CSV driving log from [Furkot] trip data.

## Install

```sh
$ npm install --save furkot-driving-log
```

## Usage

```js
var drivingLog = require('furkot-driving-log');

drivingLog(ostream, trip);
```

## License

MIT © [code42day](https://code42day.com)

[Furkot]: https://trips.furkot.com

[npm-image]: https://img.shields.io/npm/v/furkot-driving-log
[npm-url]: https://npmjs.org/package/furkot-driving-log

[build-image]: https://img.shields.io/github/workflow/status/furkot/furkot-driving-log/check
[build-url]: https://github.com/furkot/furkot-driving-log/actions/workflows/check.yaml

[deps-image]: https://img.shields.io/librariesio/github/furkot/furkot-driving-log
[deps-url]: https://libraries.io/npm/furkot-driving-log
