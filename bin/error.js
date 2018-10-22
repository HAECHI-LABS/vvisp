const fs = require('fs');
const path = require('path');
const _ = require('lodash');

function checkConfigExist() {
  if (!fs.existsSync(path.join('./', 'service.haechi.json'))) {
    throw new Error('service.haechi.json file does not exist');
  }
}

function checkEnvExist() {
  if (!fs.existsSync(path.join('./', '.env'))) {
    throw new Error('.env file does not exist');
  }

  const NETWORKS = ['local', 'mainnet', 'ropsten', 'kovan', 'rinkeby'];
  if (!process.env.NETWORK) {
    throw new Error('You should set a NETWORK in .env file');
  } else if (_.indexOf(NETWORKS, process.env.NETWORK) === -1) {
    throw new Error(
      `You should choose a NETWORK from [${NETWORKS.join(', ')}]`
    );
  } else if (process.env.NETWORK === 'local' && !process.env.PORT) {
    throw new Error('You should set PORT in .env file');
  } else if (process.env.NETWORK !== 'local' && !process.env.INFURA_API_KEY) {
    throw new Error('You should set INFURA_API_KEY in .env file');
  }

  if (!process.env.MNEMONIC) {
    throw new Error('You should set MNEMONIC in .env file');
  }
}

module.exports = {
  checkConfigExist,
  checkEnvExist
};
