const chai = require('chai');
const expect = chai.expect;
chai.should();
require('dotenv').config();

const { mnemonicToPrivateKey } = require('../../src');
const filterPrivateKey = require('../../src/utils/filterPrivateKey');

describe('# privateKeyToAddress test', function() {
  before(function() {
    this.privateKey = mnemonicToPrivateKey(process.env.MNEMONIC);
  });
  describe('# input arguments', function() {
    it('should reject when private is wrong type', function() {
      expect(() => filterPrivateKey(undefined)).to.throw(TypeError);
      expect(() => filterPrivateKey(null)).to.throw(TypeError);
      expect(() => filterPrivateKey(123)).to.throw(TypeError);
      expect(() => filterPrivateKey({ a: 1 })).to.throw(TypeError);
      expect(() => filterPrivateKey(['hello', 'there'])).to.throw(TypeError);
    });
    it("should reject when string private's length is not 64 or 66(with 0x)", function() {
      expect(() => filterPrivateKey(this.privateKey + 'd')).to.throw(TypeError);
      expect(() => filterPrivateKey('d125541543514123')).to.throw(TypeError);
    });
    it("should reject when Buffer private's length is not 32 or 64", function() {
      const shortBuffer1 = new Buffer(this.privateKey.slice(6));
      const shortBuffer2 = new Buffer(this.privateKey.slice(6), 'hex');
      const longBuffer1 = new Buffer(this.privateKey + '32');
      const longBuffer2 = new Buffer(this.privateKey + '32', 'hex');
      expect(() => filterPrivateKey(shortBuffer1)).to.throw(TypeError);
      expect(() => filterPrivateKey(shortBuffer2)).to.throw(TypeError);
      expect(() => filterPrivateKey(longBuffer1)).to.throw(TypeError);
      expect(() => filterPrivateKey(longBuffer2)).to.throw(TypeError);
    });
    it('should receive right type', function() {
      const buffer32 = new Buffer(this.privateKey, 'hex');
      const buffer64 = new Buffer(this.privateKey);
      expect(() => filterPrivateKey(buffer32)).to.not.throw();
      expect(() => filterPrivateKey(buffer64)).to.not.throw();
      expect(() => filterPrivateKey(this.privateKey)).to.not.throw();
      expect(() => filterPrivateKey('0x' + this.privateKey)).to.not.throw();
    });
  });
});
