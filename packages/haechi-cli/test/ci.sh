#!/usr/bin/env bash

cp test/dummy/test.env .
mv test.env .env

nyc --reporter=html --reporter=text mocha $(find ./test -name '*.test.js') --recursive

nyc report --reporter=text-lcov | coveralls
