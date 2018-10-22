#! /usr/bin/env node

require('dotenv').config(); // TODO: will change to configuration file
const commander = require('./commander');

try {
  commander.parse(process.argv);
  if (commander.args.length === 0) {
    commander.help();
  }
} catch (e) {
  console.error(e);
}
