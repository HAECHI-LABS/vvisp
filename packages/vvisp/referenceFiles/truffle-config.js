module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*' // eslint-disable-line camelcase
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
    },
    ...require('./scripts/local_eth_ganache_option.js')
  },
  compilers: {
    solc: {
      version: '0.5.7',
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        },
        evmVersion: 'petersburg'
      }
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
