module.exports = function(state, options) {
  const fs = require('fs');
  const { printOrSilent } = require('../../../lib');
  const { STATE_PATH } = require('../constants');

  const stateString = JSON.stringify(state, null, '  ');
  // printOrSilent(chalk.head('Service State Result'), options); // Just for debugging
  // printOrSilent(chalk.notImportant(stateString), options);
  try {
    fs.writeFileSync(STATE_PATH, stateString, 'utf8');
  } catch (e) {
    printOrSilent(chalk.error('Cannot write state file'), options);
    console.log(e);
  }
};
