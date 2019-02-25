module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*', // eslint-disable-line camelcase
      gasLimit: 123123,
      gasPrice: 10000000000
    },
    coverage: {
      host: 'localhost',
      port: 8545,
      network_id: '*' // eslint-disable-line camelcase
    }
  },
  compilers: {
    solc: {
      version: '0.4.25', // Fetch exact version from solc-bin (default: truffle's version)
      settings: {
        // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: false,
          runs: 200
        },
        evmVersion: 'byzantium'
      }
    }
  },
  from: {
    mnemonic: 'hello',
    index: 0
  }
};
