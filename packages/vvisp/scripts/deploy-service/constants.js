module.exports = (function() {
  const path = require('path');
  const { getWeb3, getPrivateKey } = require('@haechi-labs/vvisp-utils');
  const web3 = getWeb3();

  return {
    REGISTRY_PATH: path.join('./', 'contracts/upgradeable/VvispRegistry.sol'),
    TX_OPTIONS: {
      gasPrice: process.env.GAS_PRICE
        ? web3.utils.toHex(process.env.GAS_PRICE)
        : undefined,
      gasLimit: process.env.GAS_LIMIT
        ? web3.utils.toHex(process.env.GAS_LIMIT)
        : undefined
    },
    PRIVATE_KEY: getPrivateKey(process.env.MNEMONIC, process.env.PRIV_INDEX),

    // service contract property name
    VARIABLES: 'variables',
    CONSTRUCTOR: 'constructorArguments',
    INITIALIZE: 'initialize',
    UPGRADEABLE: 'upgradeable',
    PENDING_STATE: ['deploy', 'upgrade']
  };
})();
