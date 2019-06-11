const { Config } = require('@haechi-labs/vvisp-utils');

module.exports = function(configOption, networkSetter) {
  setters.config(configOption);
  setters.setNetwork(networkSetter);

  return {
    config: setters.config,
    ...loadApis()
  };
};

function loadApis() {
  const apis = {};

  apis['HaechiV1'] = require('./js/HaechiV1.js');

  return apis;
}

const setters = {
  config: configObj => {
    let config;
    try {
      config = Config.get(configObj);
    } catch (e) {}
    if (!config) {
      config = new Config();
      config.merge(configObj);
    }
    Config.setStore(config);
  },
  setNetwork: networkSetter => {
    const config = Config.get();
    const blockchainApiStore = config.blockchainApiStore;
    if (networkSetter && typeof networkSetter === 'string') {
      blockchainApiStore.setWithURL(networkSetter);
    } else if (networkSetter) {
      blockchainApiStore.setWithProvider(networkSetter);
    } else {
      const config = Config.get();
      let provider;
      try {
        provider = config.provider;
      } catch (e) {}
      if (!provider) {
        throw new Error(
          `Input network config as the second parameter or set network in config file`
        );
      }
      if (typeof provider === 'string') {
        blockchainApiStore.setWithURL(provider);
      } else {
        blockchainApiStore.setWithProvider(provider);
      }
    }
  }
};
