const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { execSync } = require('child_process');
const {
  getAllFiles,
  printOrSilent
} = require('@haechi-labs/vvisp-utils');

module.exports = async function(files, options) {
  options = require('./utils/injectConfig')(options);

  try {
    execSync('command -v docker');
  } catch {
    console.error('Requirement: docker must be installed');
    console.error('>>> $ sudo apt install docker')

    return;
  }

  try {
    execSync('docker image inspect mythril/myth', { stdio: 'pipe' });
  } catch {
    console.error('Requirement: mythril/myth must be pulled');
    console.error('>>> $ docker pull mythril/myth');

    return;
  }

  if (options.allContract) {
    files = getAllFiles('./contracts', filePath => {
      return path.parse(filePath).ext === '.sol';
    });
  }

  if (files.length === 0) {
    const url = `${options.config.network_config.host}:${options.config.network_config.port}`;
    const vvispState = JSON.parse(fs.readFileSync('./state.vvisp.json', 'utf-8'));

    Object.keys(vvispState.contracts)
      .forEach(contractName => {
        printOrSilent(chalk.bold(`Contract: ${contractName}`), options);

        const address = vvispState.contracts[contractName].address;
        const command = `docker run --network=host mythril/myth -xa ${address} --rpc ${url}`;
        const result = execSync(command, { stdio: 'pipe' }).toString();

        printOrSilent(result, options);
    });
  } else {
    files
      .forEach(file => {
        printOrSilent(chalk.bold(`File: ${file}`), options);

        const dirName = path.dirname(path.resolve(file));
        const baseName = path.basename(file);

        const command = `docker run -v ${dirName}:/tmp mythril/myth -x tmp/${baseName}`;
        const result = execSync(command, { stdio: 'pipe' }).toString();

        printOrSilent(result, options);
      });
  }
};
