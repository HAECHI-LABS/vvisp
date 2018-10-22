require('dotenv').config();
require('babel-register');
require('babel-polyfill');

// http://truffleframework.com/tutorials/using-infura-custom-provider
const HDWalletProvider = require('truffle-hdwallet-provider');
const providerWithMnemonic = (mnemonic, providerUrl) =>
  new HDWalletProvider(mnemonic, providerUrl);
const infuraProvider = network =>
  providerWithMnemonic(
    process.env.MNEMONIC || '',
    `https://${network}.infura.io/${process.env.INFURA_API_KEY}`
  );

const ropstenProvider = process.env.SOLIDITY_COVERAGE
  ? undefined
  : infuraProvider('ropsten');

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*' // eslint-disable-line camelcase
    },
    ropsten: {
      provider: ropstenProvider,
      gas: 4600000,
      network_id: 3 // eslint-disable-line camelcase
    },
    coverage: {
      host: 'localhost',
      network_id: '*', // eslint-disable-line camelcase
      port: 8555,
      gas: 0xfffffffffff,
      gasPrice: 0x01
    },
    ganache: {
      host: 'localhost',
      port: 8545,
      network_id: '*' // eslint-disable-line camelcase
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  mocha: {
    reporter: 'eth-gas-reporter',
    reporterOptions: {
      currency: 'KRW',
      gasPrice: 5
    }
  }
};
