const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised')).should();
const _ = require('lodash');

const { compile, getCompiledContracts } = require('../src');
const path = require('path');

const ERROR_CONTRACT = path.join(__dirname, '../contracts/ErrorContract.sol');
const ERROR_IMPORT_CONTRACT = path.join(
  __dirname,
  '../contracts/ErrorImportContract.sol'
);
const RIGHT_CONTRACT1 = path.join(__dirname, '../contracts/DependencyA.sol');
const RIGHT_CONTRACT2 = path.join(__dirname, '../contracts/DependencyB.sol');
const VERSION5 = path.join(__dirname, '../contracts/Version5.sol');
const OPEN_NFT = path.join(__dirname, '../contracts/MyNFT.sol');

describe('# compile test', function() {
  this.timeout(50000);

  const configWrapper = {
    compilers: {
      solc: {
        settings: {
          optimizer: {}
        }
      }
    }
  };

  describe('# input arguments', function() {
    it('should reject wrong input type', async function() {
      await compile(1123, { silent: true }).should.be.rejectedWith(TypeError);
      await compile({ a: 1, b: 2 }, { silent: true }).should.be.rejectedWith(
        TypeError
      );
    });

    it('should reject wrong path input', async function() {
      await compile('hi', { silent: true }).should.be.rejected;
      await compile(['hi', 'hello'], { silent: true }).should.be.rejected;
    });
  });

  describe('# work process', function() {
    it('should reject error contract', async function() {
      await compile(ERROR_CONTRACT, { silent: true }).should.be.rejectedWith(
        Error
      );
    });

    it('should reject contract which imports wrong modules', async function() {
      await compile(ERROR_IMPORT_CONTRACT, {
        silent: true
      }).should.be.rejectedWith(Error);
    });

    it('should be fulfilled with right contract', async function() {
      await compile(RIGHT_CONTRACT1, { silent: true }).should.be.fulfilled;
    });

    it('should be fulfilled with multi contracts', async function() {
      const files = [RIGHT_CONTRACT1, RIGHT_CONTRACT2];
      await compile(files, { silent: true }).should.be.fulfilled;
    });

    it('should be fulfilled without solc compiler', async function() {
      const config = {
        compilers: {
          otherCompiler: {}
        }
      };
      await compile(RIGHT_CONTRACT1, { silent: true, config: config }).should.be
        .fulfilled;
    });

    it('should be fulfilled with other solc version', async function() {
      const config = _.cloneDeep(configWrapper);
      process.env.SOLC_VERSION = 'v0.5.0+commit.1d4f565a';
      await compile(RIGHT_CONTRACT1, { silent: true, config: config }).should.be.fulfilled;
    });

    it('should be fulfilled with optimization', async function() {
      const config = _.cloneDeep(configWrapper);
      config.compilers.solc.settings.optimizer = {
        enabled: true,
        run: 200
      };
      await compile(RIGHT_CONTRACT1, { silent: true, config: config }).should.be
        .fulfilled;
    });

    it('should be fulfilled with solidity version 5', async function() {
      const config = _.cloneDeep(configWrapper);
      config.compilers.solc.version = '0.5.1';
      await compile(VERSION5, { silent: true, config: config }).should.be
        .fulfilled;
    });

    it('should be fulfilled with external solidity library', async function() {
      const config = _.cloneDeep(configWrapper);
      process.env.SOLC_VERSION = '0.5.0';
      await compile(OPEN_NFT, { silent: true, config: config }).should.be.fulfilled;
      process.env.SOLC_VERSION = '';
    });
  });

  describe('# result value', function() {
    it('should return different values depending on optimization', async function() {
      const optimizeConfig = _.cloneDeep(configWrapper);
      optimizeConfig.compilers.solc.settings.optimizer = {
        enabled: true,
        run: 200
      };
      const optimization = await compile(RIGHT_CONTRACT1, {
        silent: true,
        config: optimizeConfig
      }).should.be.fulfilled;
      const nonOptimizeConfig = _.cloneDeep(configWrapper);
      nonOptimizeConfig.compilers.solc.settings.optimizer = {
        enabled: false
      };
      const nonOptimization = await compile(RIGHT_CONTRACT1, {
        silent: true,
        config: nonOptimizeConfig
      }).should.be.fulfilled;

      const optByteCode = getCompiledContracts(optimization, RIGHT_CONTRACT1)
        .bytecode;
      const nonOptByteCode = getCompiledContracts(
        nonOptimization,
        RIGHT_CONTRACT1
      ).bytecode;
      optByteCode.length.should.be.below(nonOptByteCode.length);
    });

    it('should return different values depending on evmVersion', async function() {
      const byzantiumConfig = _.cloneDeep(configWrapper);
      byzantiumConfig.compilers.solc.settings.evmVersion = 'byzantium';
      const byzantium = await compile(RIGHT_CONTRACT1, {
        silent: true,
        config: byzantiumConfig
      }).should.be.fulfilled;
      const homesteadConfig = _.cloneDeep(configWrapper);
      homesteadConfig.compilers.solc.settings.evmVersion = 'homestead';
      const homestead = await compile(RIGHT_CONTRACT1, {
        silent: true,
        config: homesteadConfig
      }).should.be.fulfilled;

      const byzantiumByteCode = getCompiledContracts(byzantium, RIGHT_CONTRACT1)
        .bytecode;
      const homesteadByteCode = getCompiledContracts(homestead, RIGHT_CONTRACT1)
        .bytecode;
      byzantiumByteCode.length.should.not.equal(homesteadByteCode);
    });
  });
});
