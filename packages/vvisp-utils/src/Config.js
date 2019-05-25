// reference: https://github.com/trufflesuite/truffle/blob/40a9c615eee78f14854ced65766ed3d370da07ae/packages/truffle-config/index.js
const _ = require('lodash');
const path = require('path');

const DEFAULT_CONFIG_FILE = 'vvisp-config.js';
const DEFAULT_NETWORK = 'development';

const getConfigRoot = require('./getConfigRoot');
const getPrivateKey = require('./getPrivateKey');
const filterPrivateKey = require('./filterPrivateKey');
const forIn = require('./forIn');
const Web3 = require('web3');

function Config() {
  const self = this;

  const defaultTxOptions = {
    gasLimit: 6721975,
    gasPrice: 10000000000 // 10 gwei,
  };

  this._deepCopy = ['networks', 'compilers'];

  this._values = {
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
          },
          evmVersion: 'petersburg'
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
      get: function() {
        const value = self._values['from'];
        if (typeof value === 'string') {
          return value;
        } else if (typeof value === 'object' && value !== null) {
          return getPrivateKey(value.mnemonic, value.index);
        } else {
          throw new Error(`from is not set properly, got ${value}`);
        }
      },
      set: function(value) {
        if (typeof value === 'string') {
          self._values['from'] = filterPrivateKey(value);
          return;
        } else if (typeof value === 'object' && value !== null) {
          if (typeof value.mnemonic === 'string') {
            self._values['from'] = value;
            return;
          }
        }
        throw new TypeError(`${JSON.stringify(value)} is invalid key format`);
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

        return provider;
      },
      set: function() {
        throw new Error(
          "Don't set config.provider directly. Instead, set config.networks and then set config.networks[<network name>].provider"
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

  if (!config.network && config.networks.hasOwnProperty(DEFAULT_NETWORK)) {
    config.network = DEFAULT_NETWORK;
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
