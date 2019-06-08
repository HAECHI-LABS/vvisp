const { printOrSilent } = require('@haechi-labs/vvisp-utils');
const { execSync } = require('child_process');

module.exports = async function(options) {
  if (options.coverage) {
    const result = execSync('sh scripts/coverage.sh');
  } else {
    const result = execSync('sh scripts/test.sh');
  }

  printOrSilent(result.toString(), options);
}
