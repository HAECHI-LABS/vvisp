module.exports = function(options = {}) {
  const { Config, printOrSilent } = require('@haechi-labs/vvisp-utils');

  // inject options
  const config = Config.get(options);
  const blockchainApiStore = config.blockchainApiStore;

  // generate web3
  if (typeof config.provider === 'string') {
    blockchainApiStore.setWithURL(config.provider);
  } else {
    blockchainApiStore.setWithProvider(config.provider);
  }

  options.config = config;
  options.platform = config.platform;

  if (options.platform === 'klaytn') {
    printOrSilent(
      '\nIn Klaytn, the gasPrice is fixed at 25ston(25000000000). No other values are allowed.',
      options
    );
    printOrSilent('GasPrice is changed to 25ston.\n', options);
    config.gasPrice = 25000000000;
  }

  printOrSilent('Network: ' + options.config.network, options);

  return options;
};
