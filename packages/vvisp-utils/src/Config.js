// reference: https://github.com/trufflesuite/truffle/blob/40a9c615eee78f14854ced65766ed3d370da07ae/packages/truffle-config/index.js
const _ = require('lodash');
const path = require('path');

const DEFAULT_CONFIG_FILE = 'vvisp-config.js';
const { DEFAULT_PLATFORM, KLAYTN, ETHEREUM } = require('../constants');
const DEFAULT_NETWORK = 'development';

const getConfigRoot = require('./getConfigRoot');
const getPrivateKey = require('./getPrivateKey');
const getAddress = require('./blockchainApis/getAddress');
const filterPrivateKey = require('./filterPrivateKey');
const forIn = require('./forIn');

const web3Store = require('./web3Store');
const caverStore = require('./caverStore');

function Config() {
  const self = this;

  const defaultTxOptions = {
    gasLimit: 6721975,
    gasPrice: 10000000000 // 10 gwei,
  };

  this._deepCopy = ['networks', 'compilers'];

  this._values = {
    platform: null, // default config is ethereum
    network: null, // default config is development
    networks: {},
    gasLimit: null,
    gasPrice: null,
    from: null,
    compilers: {
      solc: {
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      vyper: {}
    }
  };

  const props = {
    network: {},
    networks: {},
    compilers: {},

    from: {
      //returns address
      get: function() {
        const value = self._values['from'];
        if (typeof value === 'object' && value.type === 'privateKey') {
          console.log(
            'WARNING: plain text private key store is not recommended'
          );
          return {
            address: getAddress(value.privateKey),
            privateKey: value.privateKey
          };
        } else if (typeof value === 'object' && value.type === 'mnemonic') {
          return {
            address: getAddress(getPrivateKey(value.mnemonic, value.index)),
            privateKey: getPrivateKey(value.mnemonic, value.index)
          };
        } else if (typeof value === 'object' && value.type === 'external') {
          //change to get it from clef
          return {
            address: value.address
          };
        } else {
          throw new Error(`from is not set properly, got ${value}`);
        }
      },
      set: function(value) {
        if (typeof value === 'string') {
          console.log(
            'WARNING: plain text private key store is not recommended'
          );
          self._values['from'] = {
            type: 'privateKey',
            privateKey: filterPrivateKey(value)
          };
          return;
        } else if (typeof value === 'object' && value !== null) {
          if (value.type == 'mnemonic') {
            self._values['from'] = {
              type: 'mnemonic',
              mnemonic: value.mnemonic,
              index: value.index
            };
          } else if (value.type == 'external') {
            self._values['from'] = {
              type: 'external',
              url: value.url,
              options: value.options
            };
            return;
          }
        } else {
          throw new TypeError(`${JSON.stringify(value)} is invalid key format`);
        }
      }
    },
    platform: {
      get: function() {
        if (self._values['platform']) {
          return self._values['platform'];
        }
        try {
          return self.network_config.platform;
        } catch (e) {
          return DEFAULT_PLATFORM;
        }
      },
      set: function(newPlatform) {
        self._values['platform'] = newPlatform;
      }
    },
    network_config: {
      get: function() {
        const network = self.network;

        if (network === null || network === undefined) {
          throw new Error(
            'Network not set. Cannot determine network to use. Set config.network or add option --network <network>'
          );
        }

        return _.extend({}, defaultTxOptions, self.networks[network]);
      },
      set: function() {
        throw new Error(
          'Do not set config.network_config. Instead, set config.networks with the desired values.'
        );
      }
    },
    network_id: {
      get: function() {
        try {
          return self.network_config.network_id;
        } catch (e) {
          return null;
        }
      },
      set: function() {
        throw new Error(
          'Do not set config.network_id. Instead, set config.networks and then config.networks[<network name>].network_id'
        );
      }
    },
    gasLimit: {
      get: function() {
        if (self._values['gasLimit']) {
          return self._values['gasLimit'];
        }
        try {
          return self.network_config.gas || self.network_config.gasLimit;
        } catch (e) {
          return defaultTxOptions.gasLimit;
        }
      },
      set: function(value) {
        self._values['gasLimit'] = value;
      }
    },
    gasPrice: {
      get: function() {
        if (self._values['gasPrice']) {
          return self._values['gasPrice'];
        }
        try {
          return self.network_config.gasPrice;
        } catch (e) {
          return defaultTxOptions.gasPrice;
        }
      },
      set: function(value) {
        self._values['gasPrice'] = value;
      }
    },
    provider: {
      get: function() {
        if (!self.network) {
          return null;
        }
        const options = self.network_config;

        let provider;

        switch (self.platform) {
          case ETHEREUM: {
            const Web3 = self.blockchainApiStore.get();
            if (options.provider && typeof options.provider === 'function') {
              provider = options.provider();
            } else if (options.provider) {
              provider = options.provider;
            } else if (options.url) {
              provider = new Web3.providers.HttpProvider(options.url, {
                keepAlive: false
              });
            } else if (options.websockets) {
              provider = new Web3.providers.WebsocketProvider(
                'ws://' + options.host + ':' + options.port
              );
            } else {
              provider = new Web3.providers.HttpProvider(
                'http://' + options.host + ':' + options.port,
                { keepAlive: false }
              );
            }

            break;
          }
          case KLAYTN: {
            if (options.provider && typeof options.provider === 'function') {
              provider = options.provider();
            } else if (options.provider) {
              provider = options.provider;
            } else if (options.url) {
              provider = options.url;
            } else {
              provider = 'http://' + options.host + ':' + options.port;
            }

            break;
          }
          default:
            throw new Error('platform is not defined');
        }

        return provider;
      },
      set: function() {
        throw new Error(
          "Don't set config.provider directly. Instead, set config.networks and then set config.networks[<network name>].provider"
        );
      }
    },
    blockchainApiStore: {
      get: function() {
        switch (self.platform) {
          case ETHEREUM: {
            return web3Store;
          }
          case KLAYTN: {
            return caverStore;
          }
          default:
            throw new Error('platform is not defined');
        }
      },
      set: function() {
        throw new Error(
          'Do not set config.blockchainApiStore directly. Instead, set config.platform'
        );
      }
    }
  };

  forIn(props, (value, key) => {
    self.addProperty(key, value);
  });
}

Config.prototype.addProperty = function(propertyName, descriptor = {}) {
  Object.defineProperty(this, propertyName, {
    get:
      descriptor.get ||
      function() {
        // value is specified
        if (propertyName in this._values) {
          return this._values[propertyName];
        }

        // default getter is specified
        if (descriptor.default) {
          return descriptor.default();
        }

        // descriptor is a function
        return descriptor();
      },
    set:
      descriptor.set ||
      function(value) {
        this._values[propertyName] = descriptor.transform
          ? descriptor.transform(value)
          : value;
      },
    configurable: true,
    enumerable: true
  });
};

Config.prototype.merge = function(obj = {}) {
  const self = this;
  const clone = _.cloneDeep(obj);

  forIn(clone, (value, key) => {
    if (self.hasOwnProperty(key)) {
      if (typeof clone[key] === 'object' && self._deepCopy.includes(key)) {
        self[key] = _.merge(self[key], clone[key]);
      } else {
        self[key] = clone[key];
      }
    }
  });

  return this;
};

Config.search = (options = {}) => {
  const configFileName = options.configFile || DEFAULT_CONFIG_FILE;
  // if there is no file, getConfigRoot will throw error
  return path.join(getConfigRoot(configFileName), configFileName);
};

Config.load = options => {
  const file = Config.search(options);

  const config = new Config();

  const fileConfig = require(file);
  config.merge(fileConfig);
  config.merge(options);

  if (!config.network) {
    config.network = DEFAULT_NETWORK;
  }

  if (!config.networks.hasOwnProperty(config.network)) {
    const networkMessage =
      config.network + (config.network === DEFAULT_NETWORK ? '(default)' : '');
    throw new Error('A network named ' + networkMessage + ' does not exist');
  }

  if (!config.platform) {
    config.platform = DEFAULT_PLATFORM;
  }

  if (!config.compilers.solc.settings.evmVersion) {
    switch (config.platform) {
      case ETHEREUM: {
        config.compilers.solc.settings.evmVersion = 'petersburg';
        break;
      }
      case KLAYTN: {
        config.compilers.solc.settings.evmVersion = 'byzantium';
        break;
      }
    }
  } else if (
    config.platform === KLAYTN &&
    config.compilers.solc.settings.evmVersion === 'petersburg'
  ) {
    throw new Error(
      'Notice, Klaytn platform does not support petersburg evmVersion currently, change it to byzantium'
    );
  }

  return config;
};

let storedConfig;

Config.get = options => {
  if (!storedConfig) {
    storedConfig = Config.load(options);
  }

  return storedConfig;
};

Config.setStore = config => {
  if (!(config instanceof Config)) {
    throw new TypeError('Should set an instance of Config');
  }
  storedConfig = config;
};

Config.delete = () => {
  storedConfig = undefined;
};

module.exports = Config;
