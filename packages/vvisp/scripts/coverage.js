const { printOrSilent } = require('@haechi-labs/vvisp-utils');
const { execSync } = require('child_process');

module.exports = async function(options) {
  const result = execSync('sh scripts/coverage.sh');

  printOrSilent(result.toString(), options);

  // testscript.stdout.on('data', function(data){
  //    console.log(data);
  // });
  // testscript.stderr.on('data', function(data){
  //     console.log(data);
  // });
};
