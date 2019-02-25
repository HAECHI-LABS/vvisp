const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised')).should();

const Web3 = require('web3');
const { web3Store } = require('../src');

const path = require('path');
const fs = require('fs-extra');
const testEnv = fs.readJsonSync(path.join(__dirname, 'test.env.json'));

describe('web3Store', function() {
  beforeEach(function() {
    web3Store.delete();
  });

  after(function() {
    web3Store.delete();
  });

  describe('#setWithProvider()', function() {
    it('should set with provider', async function() {
      web3Store.setWithProvider(new Web3.providers.HttpProvider(testEnv.url));
      const web3 = web3Store.get();
      expect(web3).to.be.an.instanceOf(Web3);
      await web3.eth.getCoinbase().should.be.fulfilled;
    });
  });

  describe('#setWithURL()', function() {
    it('should set with url', async function() {
      web3Store.setWithURL(testEnv.url);
      const web3 = web3Store.get();
      expect(web3).to.be.an.instanceOf(Web3);
      await web3.eth.getCoinbase().should.be.fulfilled;
    });
  });

  describe('#get()', function() {
    it('should return void web3 when it is not set', async function() {
      const web3 = web3Store.get();
      expect(web3).to.be.an.instanceOf(Web3);
      await web3.eth.getCoinbase().should.be.rejected;
    });
  });

  describe('#delete()', function() {
    it('should delete stored web3', async function() {
      web3Store.setWithURL(testEnv.url);
      web3Store.delete();

      const web3 = web3Store.get();
      expect(web3).to.be.an.instanceOf(Web3);
      await web3.eth.getCoinbase().should.be.rejected;
    });
  });
});
