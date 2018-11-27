module.exports = (function() {
  const path = require('path');
  const { getWeb3, mnemonicToPrivateKey } = require('@haechi-labs/vvisp-utils');
  const web3 = getWeb3();

  return {
    SERVICE_PATH: path.join('./', 'service.vvisp.json'),
    STATE_PATH: path.join('./', 'state.vvisp.json'),
    REGISTRY_PATH: path.join('./', 'contracts/upgradeable/Registry.sol'),
    PROXY_PATH: path.join(
      './',
      'contracts/upgradeable/OwnedUpgradeabilityProxy.sol'
    ),
    TX_OPTIONS: {
      gasPrice: process.env.GAS_PRICE
        ? web3.utils.toHex(process.env.GAS_PRICE)
        : undefined
    },
    PRIVATE_KEY: mnemonicToPrivateKey(
      process.env.MNEMONIC,
      process.env.PRIV_INDEX
    ),

    // service contract property name
    VARIABLES: 'variables',
    CONSTRUCTOR: 'constructorArguments',
    INITIALIZE: 'initialize',
    UPGRADEABLE: 'upgradeable',
    PENDING_STATE: ['deploy', 'upgrade']
  };
})();
