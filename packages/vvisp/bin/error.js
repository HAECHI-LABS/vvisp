const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const NETWORKS = {
  local: 'local',
  mainnet: 'mainnet',
  ropsten: 'ropsten',
  kovan: 'kovan',
  rinkeby: 'rinkeby',
  custom: 'custom'
};

const SERVICE_PATH = path.join('./', 'service.vvisp.json');
const ENV_PATH = path.join('./', '.env');

function checkConfigExist() {
  if (!fs.existsSync(SERVICE_PATH)) {
    throw new Error('service.vvisp.json file does not exist');
  }
}

function checkEnv() {
  if (!fs.existsSync(ENV_PATH)) {
    throw new Error('.env file does not exist');
  }

  if (!process.env.NETWORK) {
    throw new Error('You should set a NETWORK in .env file');
  } else if (_.includes(NETWORKS, process.env.NETWORK) === false) {
    throw new Error(`You should choose a NETWORK from [${_.values(NETWORKS)}]`);
  } else {
    switch (process.env.NETWORK) {
      case NETWORKS.local: {
        if (!process.env.PORT) {
          throw new Error(
            `You should set PORT in .env file when you choose 'local'`
          );
        }
        break;
      }
      case NETWORKS.custom: {
        if (!process.env.URL) {
          throw new Error(
            `You should set URL in .env file when you choose 'custom'`
          );
        }
        break;
      }
      default: {
        if (!process.env.INFURA_API_KEY) {
          throw new Error('You should set INFURA_API_KEY in .env file');
        }
        break;
      }
    }
  }

  if (!process.env.MNEMONIC && !process.env.PRIVATE_KEY) {
    throw new Error('You should set MNEMONIC or PRIVATE_KEY in .env file');
  }
}

module.exports = {
  checkConfigExist,
  checkEnv,
  constants: {
    NETWORKS,
    SERVICE_PATH,
    ENV_PATH
  }
};
