const chai = require('chai');
chai.use(require('chai-as-promised')).should();
require('dotenv').config();

const {
  compile,
  deploy,
  getCompiledContracts,
  getWeb3,
  mnemonicToPrivateKey,
  privateKeyToAddress
} = require('../src');
const web3 = getWeb3();
const path = require('path');

const RIGHT_CONTRACT = path.join(__dirname, '../contracts/DependencyA.sol');
const ARRAY_INPUT_CONTRACT = path.join(
  __dirname,
  '../contracts/DependencyD.sol'
);
const NO_INPUT_CONTRACT = path.join(__dirname, '../contracts/SecondB.sol');
const PRIV_KEY = mnemonicToPrivateKey(process.env.MNEMONIC);
const SENDER = privateKeyToAddress(PRIV_KEY);

describe('# deploy test', function() {
  this.timeout(50000);

  before(async function() {
    const compileOutput = await compile(
      [RIGHT_CONTRACT, ARRAY_INPUT_CONTRACT, NO_INPUT_CONTRACT],
      true
    ).should.be.fulfilled;
    this.dependencyA = getCompiledContracts(compileOutput, RIGHT_CONTRACT);
    this.dependencyD = getCompiledContracts(
      compileOutput,
      ARRAY_INPUT_CONTRACT
    );
    this.secondB = getCompiledContracts(compileOutput, NO_INPUT_CONTRACT);
  });

  describe('# input arguments', function() {
    it('should reject wrong input arguments length', async function() {
      await deploy(this.dependencyA, PRIV_KEY).should.be.rejectedWith(Error);
      await deploy(this.dependencyD, PRIV_KEY, []).should.be.rejectedWith(
        Error
      );
      await deploy(this.dependencyD, PRIV_KEY, [
        1,
        2,
        3,
        4,
        55,
        6,
        6
      ]).should.be.rejectedWith(Error);
    });

    it("should omit arguments when it doesn't need", async function() {
      await deploy(this.secondB, PRIV_KEY, [1, 6]).should.be.fulfilled;
    });

    it('should parse string to array', async function() {
      await deploy(this.dependencyD, PRIV_KEY, ['[1,2,3]', SENDER]).should.be
        .fulfilled;
    });

    it('should receive options without arguments', async function() {
      await deploy(this.secondB, PRIV_KEY, { gasPrice: web3.utils.toHex(20e9) })
        .should.be.fulfilled;
    });
  });

  describe('# work process', function() {
    it('should deploy contracts properly', async function() {
      await deploy(this.dependencyA, PRIV_KEY, [SENDER, SENDER, SENDER]).should
        .be.fulfilled;
      await deploy(this.dependencyD, PRIV_KEY, [[1, 2, 3], SENDER]).should.be
        .fulfilled;
      await deploy(this.secondB, PRIV_KEY).should.be.fulfilled;
    });
  });

  describe('# result value', function() {
    it('should have contract address in receipt', async function() {
      const receipt = await deploy(this.secondB, PRIV_KEY, {
        gasPrice: web3.utils.toHex(20e9)
      }).should.be.fulfilled;
      const address = receipt.contractAddress;
      web3.utils.isAddress(address).should.be.equal(true);
    });
  });
});
