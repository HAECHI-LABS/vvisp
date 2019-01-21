const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised')).should();

const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');
const dotenv = require('dotenv').config;

const { checkConfigExist, checkEnv, constants } = require('../../bin/error');

const { NETWORKS, SERVICE_PATH, ENV_PATH } = constants;

describe('# error test', function() {
  this.timeout(50000);

  after(function() {
    delete process.env.NETWORK;
    delete process.env.URL;
    delete process.env.PORT;
    delete process.env.INFURA_API_KEY;
    delete process.env.MNEMONIC;
    delete process.env.PRIV_INDEX;
    delete process.env.GAS_PRICE;
    delete process.env.GAS_LIMIT;
    delete process.env.SOLC_VERSION;
    delete process.env.SOLC_OPTIMIZATION;
    dotenv();
  });

  describe('checkConfigExist()', function() {
    beforeEach(function() {
      fs.remove(path.join(SERVICE_PATH));
    });

    it('should throw error when service.vvisp.json file does not exist', function() {
      expect(() => checkConfigExist()).to.throw(
        'service.vvisp.json file does not exist'
      );
    });

    it('should not throw error when service.vvisp.json exists', function() {
      fs.writeJsonSync(SERVICE_PATH, { serviceName: 'test' });
      expect(() => checkConfigExist()).to.not.throw();
      fs.remove(path.join(SERVICE_PATH));
    });
  });

  describe('checkEnv()', function() {
    const tmpENV = path.join('./', 'tmp.env');

    before(function() {
      dotenv();
      fs.moveSync(ENV_PATH, tmpENV, { overwrite: true });
    });

    after(function() {
      fs.moveSync(tmpENV, ENV_PATH, { overwrite: true });
    });

    it('should throw error when service.vvisp.json file does not exist', function() {
      expect(() => checkEnv()).to.throw('.env file does not exist');
    });

    describe('when .env exists', function() {
      before(function() {
        fs.copyFileSync(tmpENV, ENV_PATH);
      });

      describe('NETWORK', function() {
        it('should throw error when NETWORK is not set', function() {
          delete process.env.NETWORK;
          expect(() => checkEnv()).to.throw(
            'You should set a NETWORK in .env file'
          );
        });

        it('should throw error when wrong NETWORK is set', function() {
          process.env.NETWORK = 'wrong';
          expect(() => checkEnv()).to.throw(
            `You should choose a NETWORK from [${_.values(NETWORKS)}]`
          );
        });

        it('should throw error when PORT is not set in local NETWORK', function() {
          process.env.NETWORK = NETWORKS.local;
          delete process.env.PORT;
          expect(() => checkEnv()).to.throw(
            `You should set PORT in .env file when you choose 'local'`
          );
        });

        it('should throw error when URL is not set in custom NETWORK', function() {
          process.env.NETWORK = NETWORKS.custom;
          delete process.env.URL;
          expect(() => checkEnv()).to.throw(
            `You should set URL in .env file when you choose 'custom'`
          );
        });

        describe('should throw error when INFURA_API_KEY is not set in other NETWORK', function() {
          const INFURA_API_KEY = process.env.INFURA_API_KEY;
          before(function() {
            delete process.env.INFURA_API_KEY;
          });

          after(function() {
            process.env.INFURA_API_KEY = INFURA_API_KEY;
          });

          it(NETWORKS.kovan, function() {
            process.env.NETWORK = NETWORKS.kovan;
            expect(() => checkEnv()).to.throw(
              'You should set INFURA_API_KEY in .env file'
            );
          });

          it(NETWORKS.ropsten, function() {
            process.env.NETWORK = NETWORKS.ropsten;
            expect(() => checkEnv()).to.throw(
              'You should set INFURA_API_KEY in .env file'
            );
          });

          it(NETWORKS.rinkeby, function() {
            process.env.NETWORK = NETWORKS.rinkeby;
            expect(() => checkEnv()).to.throw(
              'You should set INFURA_API_KEY in .env file'
            );
          });

          it(NETWORKS.mainnet, function() {
            process.env.NETWORK = NETWORKS.mainnet;
            expect(() => checkEnv()).to.throw(
              'You should set INFURA_API_KEY in .env file'
            );
          });
        });

        it('should not throw error with correct setting in local NETWORK', function() {
          process.env.NETWORK = NETWORKS.local;
          process.env.PORT = '8545';
          expect(() => checkEnv()).to.not.throw();
        });

        it('should not throw error with correct setting in custom NETWORK', function() {
          process.env.NETWORK = NETWORKS.custom;
          process.env.URL = 'sample.link.io:1212';
          expect(() => checkEnv()).to.not.throw();
        });

        describe('should not throw error with correct setting in other NETWORK', function() {
          it(NETWORKS.kovan, function() {
            process.env.NETWORK = NETWORKS.kovan;
            expect(() => checkEnv()).to.not.throw();
          });

          it(NETWORKS.ropsten, function() {
            process.env.NETWORK = NETWORKS.ropsten;
            expect(() => checkEnv()).to.not.throw();
          });

          it(NETWORKS.rinkeby, function() {
            process.env.NETWORK = NETWORKS.rinkeby;
            expect(() => checkEnv()).to.not.throw();
          });

          it(NETWORKS.mainnet, function() {
            process.env.NETWORK = NETWORKS.mainnet;
            expect(() => checkEnv()).to.not.throw();
          });
        });
      });

      describe('MNEMONIC', function() {
        const mnemonic = process.env.MNEMONIC;

        after(function() {
          process.env.MNEMONIC = mnemonic;
        });

        it('should throw error when MNEMONIC is not set', function() {
          delete process.env.MNEMONIC;
          expect(() => checkEnv()).to.throw(
            'You should set MNEMONIC in .env file'
          );
        });
      });
    });
  });
});
