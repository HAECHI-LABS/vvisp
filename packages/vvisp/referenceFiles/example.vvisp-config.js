// http://truffleframework.com/tutorials/using-infura-custom-provider
const INFURA_API_KEY = 'INPUT_YOUR_INFURA_API_KEY';
const MNEMONIC = 'INPUT_YOUR_MNEMONIC_WORDS';

const HDWalletProvider = require('truffle-hdwallet-provider');
const providerWithMnemonic = (mnemonic, providerUrl) =>
  new HDWalletProvider(mnemonic, providerUrl);
const infuraProvider = network =>
  providerWithMnemonic(
    MNEMONIC || '',
    `https://${network}.infura.io/${INFURA_API_KEY}`
  );

const ropstenProvider = infuraProvider('ropsten');

const truffleConfig = require('./truffle-config');

truffleConfig.networks.ropsten = {
  provider: ropstenProvider,
  gas: 4600000,
  network_id: 3 // eslint-disable-line camelcase
};

module.exports = {
  ...truffleConfig,
  from: {
    mnemonic: MNEMONIC,
    index: 0
  }
};
