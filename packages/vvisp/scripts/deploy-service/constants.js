module.exports = (function() {
  const path = require('path');
  const { Config } = require('@haechi-labs/vvisp-utils');
  const config = Config.get();

  return {
    REGISTRY_PATH: path.join('./', 'contracts/vvisp/VvispRegistry.sol'),
    TX_OPTIONS: {
      gasPrice: config.gasPrice,
      gasLimit: config.gasLimit
    },
    PRIVATE_KEY: config.from,

    // service contract property name
    VARIABLES: 'variables',
    CONSTRUCTOR: 'constructorArguments',
    INITIALIZE: 'initialize',
    PENDING_STATE: ['deploy', 'upgrade']
  };
})();
