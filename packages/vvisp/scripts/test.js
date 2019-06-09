const { printOrSilent } = require('@haechi-labs/vvisp-utils');
const { execSync } = require('child_process');

module.exports = async function(files, options) {
  let result;
  if (options.coverage) {
    result = execSync('./scripts/coverage.sh');
  } else {
    result = execSync('./scripts/test.sh');
  }

  printOrSilent(result.toString(), options);
}
