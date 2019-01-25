const chai = require('chai');
const expect = chai.expect;
chai.should();

const filterPrivateKey = require('../../src/utils/filterPrivateKey');

const SAMPLE_PRIVATE_KEY =
  '8bb0722ff8cb8161da257dc2d3712a17db1753d1de2d8b6b27b0e4636d9899f6';

describe('# filterPrivateKey test', function() {
  before(function() {
    this.privateKey = SAMPLE_PRIVATE_KEY;
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
      const shortBuffer1 = Buffer.from(this.privateKey.slice(6));
      const shortBuffer2 = Buffer.from(this.privateKey.slice(6), 'hex');
      const longBuffer1 = Buffer.from(this.privateKey + '32');
      const longBuffer2 = Buffer.from(this.privateKey + '32', 'hex');
      expect(() => filterPrivateKey(shortBuffer1)).to.throw(TypeError);
      expect(() => filterPrivateKey(shortBuffer2)).to.throw(TypeError);
      expect(() => filterPrivateKey(longBuffer1)).to.throw(TypeError);
      expect(() => filterPrivateKey(longBuffer2)).to.throw(TypeError);
    });

    it('should receive right type', function() {
      const buffer32 = Buffer.from(this.privateKey, 'hex');
      const buffer64 = Buffer.from(this.privateKey);
      expect(() => filterPrivateKey(buffer32)).to.not.throw();
      expect(() => filterPrivateKey(buffer64)).to.not.throw();
      expect(() => filterPrivateKey(this.privateKey)).to.not.throw();
      expect(() => filterPrivateKey('0x' + this.privateKey)).to.not.throw();
    });
  });
});
