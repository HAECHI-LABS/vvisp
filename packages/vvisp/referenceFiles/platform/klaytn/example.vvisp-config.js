const MNEMONIC = 'INPUT_YOUR_MNEMONIC_WORDS';

const externalConfig = require('./truffle-config');

externalConfig.networks.baobab = {
  platform: 'klaytn',
  url: 'https://api.baobab.klaytn.net:8651'
};

module.exports = {
  ...externalConfig,
  from: {
    mnemonic: MNEMONIC,
    index: 0
  }
};
