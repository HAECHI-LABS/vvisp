module.exports = function(options = {}) {
  const { Config, web3Store } = require('@haechi-labs/vvisp-utils');

  // inject options
  const config = Config.get(options);

  // generate web3
  web3Store.setWithProvider(config.provider);

  options.config = config;
  options.web3 = web3Store.get();

  return options;
};
