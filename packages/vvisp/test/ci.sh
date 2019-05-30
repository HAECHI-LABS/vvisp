#!/usr/bin/env bash

set -o errexit

cp test/dummy/sample.vvisp-config.js .
mv sample.vvisp-config.js vvisp-config.js

nyc --reporter=html --reporter=text mocha $(find ./test -name 'show-state.test.js') --recursive
