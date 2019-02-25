const fs = require('fs');
const path = require('path');
const { Config, web3Store } = require('@haechi-labs/vvisp-utils');

const files = fs.readdirSync(path.join(__dirname, 'js'));
const apis = {
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
  setWeb3: web3Setter => {
    if (web3Setter && typeof web3Setter === 'string') {
      web3Store.setWithURL(web3Setter);
    } else if (web3Setter) {
      web3Store.setWithProvider(web3Setter);
    }
  }
};

for (let i = 0; i < files.length; i++) {
  if (files[i].slice(-3) === '.js') {
    if (files[i] === 'index.js') {
      continue;
    }
    apis[files[i].slice(0, -3)] = require(`./js/${files[i].slice(0, -3)}.js`);
  }
}

module.exports = function(configOption, web3Setter) {
  apis.config(configOption);
  apis.setWeb3(web3Setter);
  return apis;
};
