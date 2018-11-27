#!/usr/bin/env bash

nyc --reporter=html --reporter=text mocha $(find ./test -name '*.test.js') --recursive
