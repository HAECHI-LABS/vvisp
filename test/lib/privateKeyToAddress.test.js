const chai = require('chai');
const expect = chai.expect;
chai.should();

const { privateKeyToAddress, mnemonicToPrivateKey } = require('../../lib');

const MNEMONIC =
  'away clutch still element short tooth spy hood army split stomach sail';

describe('# privateKeyToAddress test', function() {
  before(function() {
    this.privateKey = mnemonicToPrivateKey(MNEMONIC);
  });
  describe('# input arguments', function() {
    it('should reject when private is wrong type', function() {
      expect(() => privateKeyToAddress(undefined)).to.throw(TypeError);
      expect(() => privateKeyToAddress(null)).to.throw(TypeError);
      expect(() => privateKeyToAddress(123)).to.throw(TypeError);
      expect(() => privateKeyToAddress({ a: 1 })).to.throw(TypeError);
      expect(() => privateKeyToAddress(['hello', 'there'])).to.throw(TypeError);
    });
    it("should reject when string private's length is not 64 or 66(with 0x)", function() {
      expect(() => privateKeyToAddress(this.privateKey + 'd')).to.throw(
        TypeError
      );
      expect(() => privateKeyToAddress('d125541543514123')).to.throw(TypeError);
    });
    it("should reject when Buffer private's length is not 32 or 64", function() {
      const shortBuffer1 = new Buffer(this.privateKey.slice(6));
      const shortBuffer2 = new Buffer(this.privateKey.slice(6), 'hex');
      const longBuffer1 = new Buffer(this.privateKey + '32');
      const longBuffer2 = new Buffer(this.privateKey + '32', 'hex');
      expect(() => privateKeyToAddress(shortBuffer1)).to.throw(TypeError);
      expect(() => privateKeyToAddress(shortBuffer2)).to.throw(TypeError);
      expect(() => privateKeyToAddress(longBuffer1)).to.throw(TypeError);
      expect(() => privateKeyToAddress(longBuffer2)).to.throw(TypeError);
    });
    it('should receive right type', function() {
      const buffer32 = new Buffer(this.privateKey, 'hex');
      const buffer64 = new Buffer(this.privateKey);
      expect(() => privateKeyToAddress(buffer32)).to.not.throw();
      expect(() => privateKeyToAddress(buffer64)).to.not.throw();
      expect(() => privateKeyToAddress(this.privateKey)).to.not.throw();
      expect(() => privateKeyToAddress('0x' + this.privateKey)).to.not.throw();
    });
  });
  describe('# return value', function() {
    it('should be a string type', function() {
      const result = privateKeyToAddress(this.privateKey);
      result.should.a('string');
    });
    it('should have 42 length', function() {
      const result = privateKeyToAddress(this.privateKey);
      result.should.have.lengthOf(42);
    });
    it('should return same value', function() {
      const buffer32 = new Buffer(this.privateKey, 'hex');
      const buffer64 = new Buffer(this.privateKey);
      const return1 = privateKeyToAddress(buffer32);
      const return2 = privateKeyToAddress(buffer64);
      const return3 = privateKeyToAddress(this.privateKey);
      const return4 = privateKeyToAddress('0x' + this.privateKey);
      return1.should.equal(return2);
      return1.should.equal(return3);
      return1.should.equal(return4);
    });
    it('should return different ouputs with different inputs', function() {
      const MNEMONIC2 =
        'away clutch still element short sail spy hood army split stomach sail';
      const return1 = privateKeyToAddress(this.privateKey);
      const return2 = privateKeyToAddress(mnemonicToPrivateKey(MNEMONIC2));
      return1.should.not.equal(return2);
    });
  });
});
