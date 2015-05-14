check: lint test

lint:
	./node_modules/.bin/jshint *.js lib test

test:
	TZ=UTC+4 ./node_modules/.bin/mocha --recursive --require should

.PHONY: check lint test
