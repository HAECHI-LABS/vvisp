module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*' // eslint-disable-line camelcase
    },
    coverage: {
      host: 'localhost',
      port: 8545,
      network_id: '*', // eslint-disable-line camelcase
      gasLimit: 123123,
      gasPrice: 25000000000
    }
  },
  compilers: {
    solc: {
      version: '0.5.7', // Fetch exact version from solc-bin
      settings: {
        // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 200
        },
        evmVersion: 'petersburg'
      }
    }
  },
  from: {
    mnemonic:
      'piano garage flag neglect spare title drill basic strong aware enforce fury',
    index: 0
  }
};
