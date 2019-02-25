#! /usr/bin/env node

const commander = require('./commander');

try {
  commander.parse(process.argv);
  if (commander.args.length === 0) {
    commander.help();
  }
} catch (e) {
  console.error(e);
}
