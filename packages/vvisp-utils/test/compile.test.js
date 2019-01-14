const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised')).should();
const dotenv = require('dotenv');

const { compile, getCompiledContracts } = require('../src');
const path = require('path');

const ERROR_CONTRACT = path.join(__dirname, '../contracts/ErrorContract.sol');
const RIGHT_CONTRACT1 = path.join(__dirname, '../contracts/DependencyA.sol');
const RIGHT_CONTRACT2 = path.join(__dirname, '../contracts/DependencyB.sol');
const VERSION5 = path.join(__dirname, '../contracts/Version5.sol');

describe('# compile test', function() {
  this.timeout(50000);
  beforeEach(function() {
    dotenv.config();
  });
  describe('# input arguments', function() {
    it('should reject wrong input type', async function() {
      await compile(1123, true).should.be.rejectedWith(TypeError);
      await compile({ a: 1, b: 2 }, true).should.be.rejectedWith(TypeError);
    });
    it('should reject wrong path input', async function() {
      await compile('hi', true).should.be.rejected;
      await compile(['hi', 'hello'], true).should.be.rejected;
    });
  });
  describe('# work process', function() {
    it('should reject error contract', async function() {
      await compile(ERROR_CONTRACT, true).should.be.rejectedWith(Error);
    });
    it('should be fulfilled with right contract', async function() {
      await compile(RIGHT_CONTRACT1, true).should.be.fulfilled;
    });
    it('should be fulfilled with multi contracts', async function() {
      const files = [RIGHT_CONTRACT1, RIGHT_CONTRACT2];
      await compile(files, true).should.be.fulfilled;
    });
    it('should be fulfilled with other solc version', async function() {
      process.env.SOLC_VERSION = 'v0.4.24+commit.e67f0147';
      await compile(RIGHT_CONTRACT1, true).should.be.fulfilled;
    });
    it('should be fulfilled with nonOptimization', async function() {
      process.env.SOLC_OPTIMIZATION = 'false';
      await compile(RIGHT_CONTRACT1, true).should.be.fulfilled;
    });
    it('should be fulfilled with solidity version 5', async function() {
      process.env.SOLC_VERSION = '0.5.1';
      await compile(VERSION5, true).should.be.fulfilled;
      process.env.SOLC_VERSION = '';
    });
  });
  describe('# result value', function() {
    before(async function() {
      this.dummyPath = path.join(__dirname, '../contracts/Attachment.sol');
      this.optimization = await compile(this.dummyPath, true).should.be
        .fulfilled;
      process.env.SOLC_OPTIMIZATION = 'false';
      this.noOptimization = await compile(this.dummyPath, true).should.be
        .fulfilled;
    });
    // TODO: optimization is not working, needs to find way
    // it('should return different values depending on optimization', async function() {
    //   const optByteCode = getCompiledContracts(this.optimization, this.dummyPath).bytecode;
    //   const noOptByteCode = getCompiledContracts(this.noOptimization, this.dummyPath).bytecode;
    //   console.log(getCompiledContracts(this.optimization, this.dummyPath));
    //   console.log(getCompiledContracts(this.noOptimization, this.dummyPath));
    //   console.log(optByteCode.length, noOptByteCode.length);
    //   optByteCode.length.should.be.below(noOptByteCode.length);
    // });
  });
});
