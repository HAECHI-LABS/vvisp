const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised')).should();

const Config = require('../src/Config');
const DEFAULT_CONFIG_FILE = 'vvisp-config.js';
const { getPrivateKey } = require('../src');
const _ = require('lodash');
const path = require('path');
const fs = require('fs-extra');
const Web3 = require('web3');

const DEFAULT_TX_OPTIONS = {
  gasLimit: 6721975,
  gasPrice: 10000000000 // 10 gwei,
};
const { DEFAULT_NETWORK, DEFAULT_PLATFORM, KLAYTN } = require('../constants');

const SAMPLE_CONFIG_PATH = path.join(
  __dirname,
  './dummy/sample.vvisp-config.js'
);
const sampleConfig = require(SAMPLE_CONFIG_PATH);
const VVISP_CONFIG_PATH = path.join('./', DEFAULT_CONFIG_FILE);

describe('# Config test', function() {
  this.timeout(50000);

  let tmpConfigName = 'eoifhsoeudhf.js';
  const TMP_CONFIG_PATH = path.join('./', tmpConfigName);

  const sampleOption = {
    network: 'coverage'
  };

  before(function() {
    if (fs.existsSync(VVISP_CONFIG_PATH)) {
      fs.moveSync(VVISP_CONFIG_PATH, TMP_CONFIG_PATH);
    }
  });

  after(function() {
    if (fs.existsSync(TMP_CONFIG_PATH)) {
      fs.moveSync(TMP_CONFIG_PATH, VVISP_CONFIG_PATH);
    }
  });

  describe('#merge()', function() {
    let config;

    beforeEach(function() {
      config = new Config();
    });

    it('should merge with option', function() {
      expect(config.network).to.equal(null);
      config.merge(sampleOption);
      expect(config.network).to.equal(sampleOption.network);
    });

    it('should ignore input property if config does not have', function() {
      expect(config.hello).to.equal(undefined);
      config.merge({ hello: 'hello' });
      expect(config.hello).to.equal(undefined);
    });
  });

  describe('#addProperty()', function() {
    let config;
    const samplePropertyName = 'hello';

    beforeEach(function() {
      config = new Config();
    });

    describe('add getter', function() {
      it('should add given getter if descriptor has', function() {
        config.addProperty(samplePropertyName, {
          get: () => {
            return samplePropertyName;
          }
        });
        expect(config[samplePropertyName]).to.equal(samplePropertyName);
      });

      it('should return exist value if propertyName is registered already', function() {
        config.addProperty('network', {});
        expect(config.network).to.equal(null);
      });

      it('should add default() of descriptor if propertyName is not registered already', function() {
        config.addProperty(samplePropertyName, {
          default: () => {
            return samplePropertyName;
          }
        });
        expect(config[samplePropertyName]).to.equal(samplePropertyName);
      });

      it('should add descriptor if propertyName is not registered already and descriptor is function', function() {
        config.addProperty(samplePropertyName, () => {
          return samplePropertyName;
        });
        expect(config[samplePropertyName]).to.equal(samplePropertyName);
      });
    });

    describe('add setter', function() {
      let target = 'hi';
      const changedTo = 'bye';
      const setter = value => {
        target = value;
      };
      it('should add given setter if descriptor has', function() {
        config.addProperty(samplePropertyName, { set: setter });
        config[samplePropertyName] = changedTo;
        expect(target).to.equal(changedTo);
      });

      it('should transform() of descriptor and set if propertyName is registered already and descriptor has transform()', function() {
        config.addProperty('network', {
          transform: value => {
            return value + changedTo;
          }
        });
        config['network'] = target;
        expect(config['network']).to.equal(target + changedTo);
      });

      it('should add just setter if there is no descriptor', function() {
        config.addProperty('network');
        config['network'] = target;
        expect(config['network']).to.equal(target);
      });
    });
  });

  describe('.search()', function() {
    needsConfigFile();

    it('should throw when there is no config file', function() {
      fs.removeSync(path.join('./', DEFAULT_CONFIG_FILE));
      expect(() => Config.search()).to.throw();
    });

    it('should search default config file', function() {
      const configPath = Config.search();
      path.parse(configPath).base.should.equal(DEFAULT_CONFIG_FILE);
      const config = require(configPath);
      expect(config).to.be.an('object');
      expect(config).to.have.property('networks');
    });

    it('should search custom config file', function() {
      const customConfigFile = 'custom-config.js';
      fs.copySync(
        path.join('./', DEFAULT_CONFIG_FILE),
        path.join('./', customConfigFile)
      );
      const configPath = Config.search({ configFile: customConfigFile });
      path.parse(configPath).base.should.equal(customConfigFile);
      const config = require(configPath);
      expect(config).to.be.an('object');
      expect(config).to.have.property('networks');

      fs.removeSync(path.join('./', customConfigFile));
    });
  });

  describe('.load()', function() {
    needsConfigFile();

    it('should load config', function() {
      const config = Config.load();
      expect(config).to.be.an.instanceOf(Config);
    });
  });

  describe('.get()', function() {
    needsConfigFile();
    needsDelete();

    it('should generate and return default config if config is not generated', function() {
      expect(Config.get()).to.be.an.instanceOf(Config);
    });

    it('should return stored config if config is generated', function() {
      Config.get(sampleOption);
      expect(Config.get()).to.be.an.instanceOf(Config);
      expect(Config.get().network).to.equal(sampleOption.network);
    });
  });

  describe('.setStore()', function() {
    needsConfigFile();
    needsDelete();

    it('should throw error if input config is not an instance of Config', function() {
      expect(() => Config.setStore('hello')).to.throw(TypeError);
    });

    it('should set new config', function() {
      const originalConfig = Config.get();
      Config.setStore(Config.load(sampleOption));
      const newConfig = Config.get();
      expect(originalConfig).not.to.equal(newConfig);
    });
  });

  describe('.delete()', function() {
    needsConfigFile();
    needsDelete();

    it('should delete stored config and .get() will return default config', function() {
      const originalConfig = Config.get(sampleOption);
      expect(originalConfig.network).to.equal(sampleOption.network);
      expect(Config.get().network).to.equal(sampleOption.network);
      Config.delete();

      expect(Config.get().network).to.equal(DEFAULT_NETWORK);
      expect(Config.get().platform).to.equal(DEFAULT_PLATFORM);
    });
  });

  describe('property test', function() {
    let config;
    beforeEach(function() {
      config = new Config();
    });

    describe('#network', function() {
      const networkName = 'new_network';
      it('should set network name', function() {
        config.network = networkName;
        config.network.should.equal(networkName);
      });
    });

    describe('#networks', function() {
      const networks = sampleConfig.networks;

      it('should set networks', function() {
        config.networks = networks;
        expect(config.networks).to.deep.equal(networks);
      });
    });

    describe('#verboseRpc', function() {
      const verboseRpc = true;

      it('should set verboseRpc', function() {
        config.verboseRpc = verboseRpc;
        expect(config.verboseRpc).to.equal(verboseRpc);
      });
    });

    describe('#compilers', function() {
      const compilers = sampleConfig.compilers;

      it('should set compilers', function() {
        config.compilers = compilers;
        expect(config.compilers).to.deep.equal(compilers);
      });

      it('should throw error when platform is klaytn and evmVersion is petersburg', function() {
        Config.delete();
        config.platform = KLAYTN;
        expect(() => {
          Config.get();
        }).to.throw(Error);
      });
    });

    describe('#from', function() {
      const privateKey =
        '0xb178cf12d4126ea1db48ca32e3ce6743580ca6646391996032fc76652d699977';
      const mnemonicObject = {
        mnemonic: 'hello',
        index: 3
      };

      it('should not set invalid type', function() {
        expect(() => {
          config.from = 123;
        }).to.throw(TypeError);
        expect(() => {
          config.from = [123];
        }).to.throw(TypeError);
        expect(() => {
          config.from = { a: 123 };
        }).to.throw(TypeError);
        expect(() => {
          config.from = undefined;
        }).to.throw(TypeError);
        expect(() => {
          config.from = null;
        }).to.throw(TypeError);
      });

      it('should set privateKey and return right key', function() {
        config.from = privateKey;
        config.from.should.equal(privateKey);
      });

      it('should set mnemonic and index and return right key', function() {
        config.from = mnemonicObject;
        config.from.should.equal(
          getPrivateKey(mnemonicObject.mnemonic, mnemonicObject.index)
        );
      });

      it('should return null when it is not set', function() {
        let getter;
        expect(() => {
          getter = config.from;
        }).to.throw(Error);
      });
    });

    describe('needs networks set', function() {
      const DEVELOPMENT = DEFAULT_NETWORK;
      beforeEach(function() {
        config.networks = sampleConfig.networks;
      });

      describe('#network_config', function() {
        it('should not set directly', function() {
          expect(() => {
            config.network_config = sampleConfig.networks[DEVELOPMENT];
          }).to.throw();
        });

        it('should not return when network is not set', function() {
          let getter;
          expect(() => {
            getter = config.network_config;
          }).to.throw();
        });

        it('should return network_config', function() {
          config.network = DEVELOPMENT;
          expect(config.network_config).to.deep.equal(
            _.extend({}, DEFAULT_TX_OPTIONS, sampleConfig.networks[DEVELOPMENT])
          );
        });
      });

      describe('#network_id', function() {
        it('should not set directly', function() {
          expect(() => {
            config.network_id = 3;
          }).to.throw();
        });

        it('should get right network_id', function() {
          config.network = DEVELOPMENT;
          const expectation = sampleConfig.networks[DEVELOPMENT].network_id;
          config.network_id.should.equal(expectation);
        });

        it('should return null if network is not set', function() {
          expect(config.network_id).to.equal(null);
        });
      });

      describe('#gasLimit', function() {
        const TEST_NETWORK = 'coverage';
        it('should return default gasLimit when network is not set', function() {
          expect(config.gasLimit).to.equal(DEFAULT_TX_OPTIONS.gasLimit);
        });

        it('should return right gasLimit', function() {
          config.network = TEST_NETWORK;
          expect(config.gasLimit).to.equal(
            sampleConfig.networks[TEST_NETWORK].gasLimit
          );
        });

        it('should prioritize option', function() {
          config.network = TEST_NETWORK;
          const optionGasLimit = 300;
          config.merge({ gasLimit: optionGasLimit });
          expect(config.gasLimit).to.equal(optionGasLimit);
        });

        it('should allow to receive gas also instead of gasLimit', function() {
          const tmpConfig = _.cloneDeep(sampleConfig);
          delete tmpConfig.networks[TEST_NETWORK].gasLimit;
          const sampleGas = 123123;
          tmpConfig.networks[TEST_NETWORK].gas = sampleGas;

          config.networks = tmpConfig.networks;
          config.network = TEST_NETWORK;
          expect(config.gasLimit).to.equal(sampleGas);
        });
      });

      describe('#gasPrice', function() {
        const TEST_NETWORK = 'coverage';
        it('should return default gasPrice when network is not set', function() {
          expect(config.gasPrice).to.equal(DEFAULT_TX_OPTIONS.gasPrice);
        });

        it('should return right gasPrice', function() {
          config.network = TEST_NETWORK;
          expect(config.gasPrice).to.equal(
            sampleConfig.networks[TEST_NETWORK].gasPrice
          );
        });

        it('should prioritize option', function() {
          config.network = TEST_NETWORK;
          const optionGasPrice = 300;
          config.merge({ gasPrice: optionGasPrice });
          expect(config.gasPrice).to.equal(optionGasPrice);
        });
      });

      describe('#platform', function() {
        const TEST_NETWORK = 'coverage';
        beforeEach(function() {
          config.networks[TEST_NETWORK].platform = KLAYTN;
        });

        it('should return default platform when network is not set', function() {
          expect(config.platform).to.equal(DEFAULT_PLATFORM);
        });

        it('should return right platform', function() {
          config.network = TEST_NETWORK;
          expect(config.platform).to.equal(
            sampleConfig.networks[TEST_NETWORK].platform
          );
        });

        it('should prioritize option', function() {
          config.network = TEST_NETWORK;
          const optionPlatform = 'NewPlatform';
          config.merge({ platform: optionPlatform });
          expect(config.platform).to.equal(optionPlatform);
        });
      });

      describe('#provider', function() {
        beforeEach(function() {
          config.platform = DEFAULT_PLATFORM;
        });

        it('should not set directly', function() {
          expect(() => {
            config.provider = 'something';
          }).to.throw();
        });

        it('should return null when network is not set', function() {
          expect(config.provider).to.equal(null);
        });

        it('should return right provider', async function() {
          config.network = DEVELOPMENT;
          const provider = config.provider;
          const web3 = new Web3();
          web3.setProvider(provider);
          await web3.eth.getCoinbase().should.be.fulfilled;
        });
      });
    });
  });
});

function needsConfigFile() {
  beforeEach(function() {
    fs.copySync(SAMPLE_CONFIG_PATH, path.join('./', DEFAULT_CONFIG_FILE));
  });

  afterEach(function() {
    fs.removeSync(path.join('./', DEFAULT_CONFIG_FILE));
  });
}

function needsDelete() {
  beforeEach(function() {
    Config.delete();
  });

  afterEach(function() {
    Config.delete();
  });
}
