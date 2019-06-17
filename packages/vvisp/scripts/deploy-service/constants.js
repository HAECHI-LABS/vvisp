module.exports = (function() {
  const { Config } = require('@haechi-labs/vvisp-utils');
  const config = Config.get();

  return {
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
