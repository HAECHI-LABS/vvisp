const INFURA_API_KEY = 'INPUT_YOUR_INFURA_API_KEY';
const MNEMONIC = 'INPUT_YOUR_MNEMONIC_WORDS';

const externalConfig = require('./truffle-config');

externalConfig.networks.ropsten = {
  url: `https://ropsten.infura.io/v3/${INFURA_API_KEY}`
};

module.exports = {
  ...externalConfig,
  // or from: '0x9741fa712a6912b862c9043f8752ffae513cb01895985998c61620da5aaf2d2d' // private Key
  from: {
    mnemonic: MNEMONIC,
    index: 0
  }
};
