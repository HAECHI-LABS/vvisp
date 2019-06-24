const MNEMONIC = 'INPUT_YOUR_MNEMONIC_WORDS';

const externalConfig = require('./truffle-config');

externalConfig.networks.baobab = {
  platform: 'klaytn',
  url: 'https://api.baobab.klaytn.net:8651'
};

module.exports = {
  // network: baobab, // If you want to use baobab network, uncomment this line.
  ...externalConfig,
  // or from: '0x9741fa712a6912b862c9043f8752ffae513cb01895985998c61620da5aaf2d2d' // private Key
  from: {
    mnemonic: MNEMONIC,
    index: 0
  }
};
