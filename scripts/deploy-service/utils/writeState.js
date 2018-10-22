module.exports = function(state, options) {
  const fs = require('fs');
  const { printOrSilent } = require('../../../lib');
  const { STATE_PATH } = require('../constants');

  printOrSilent('Service State Result', options);
  const stateString = JSON.stringify(state, null, '  ');
  printOrSilent(stateString, options);
  try {
    fs.writeFileSync(STATE_PATH, stateString, 'utf8');
  } catch (e) {
    printOrSilent('Cannot write state file', options);
    console.log(e);
  }
};
