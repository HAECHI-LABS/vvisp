const INFURA_API_KEY = 'INPUT_YOUR_INFURA_API_KEY';
const MNEMONIC = 'INPUT_YOUR_MNEMONIC_WORDS';

const externalConfig = require('./truffle-config');

externalConfig.networks.ropsten = {
  url: `https://ropsten.infura.io/v3/${INFURA_API_KEY}`
};

externalConfig.networks.baobab = {
  platform: 'klaytn',
  url: 'URL_TO_KLAYTN_NODE'
};

module.exports = {
  ...externalConfig,
  from: {
    mnemonic: MNEMONIC,
    index: 0
  }
};
