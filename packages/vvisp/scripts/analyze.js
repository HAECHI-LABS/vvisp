const path = require('path');
const { execSync } = require('child_process');
const { printOrSilent } = require('@haechi-labs/vvisp-utils');

module.exports = async function(contract, options) {

  try {
    execSync('command -v docker');
  } catch {
    console.error('required: sudo apt install docker');
    return;
  }

  try {
    execSync('sudo docker image inspect mythril/myth', { stdio: ['pipe'] });
  } catch {
    console.error('required: docker pull mythril/myth');
    return;
  }

  const dirName = path.dirname(path.resolve(contract));
  const baseName = path.basename(contract);

  const command = `sudo docker run -v ${dirName}:/tmp mythril/myth -x tmp/${baseName}`;
  const result = execSync(command).toString();

  printOrSilent(result, options);
};
