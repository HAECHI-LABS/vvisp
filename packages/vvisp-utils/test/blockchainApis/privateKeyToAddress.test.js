const chai = require('chai');
chai.should();

const { privateKeyToAddress } = require('../../src');

const SAMPLE_PRIVATE_KEY =
  '8bb0722ff8cb8161da257dc2d3712a17db1753d1de2d8b6b27b0e4636d9899f6';

describe('# privateKeyToAddress test', function() {
  before(function() {
    this.privateKey = SAMPLE_PRIVATE_KEY;
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
      const buffer32 = Buffer.from(this.privateKey, 'hex');
      const buffer64 = Buffer.from(this.privateKey);
      const return1 = privateKeyToAddress(buffer32);
      const return2 = privateKeyToAddress(buffer64);
      const return3 = privateKeyToAddress(this.privateKey);
      const return4 = privateKeyToAddress('0x' + this.privateKey);
      return1.should.equal(return2);
      return1.should.equal(return3);
      return1.should.equal(return4);
    });

    it('should return different outputs with different inputs', function() {
      const DIFFERENT_PRIVATE_KEY =
        '8bb0722ff8cb8161da257dc2d3712a17db1753d1de2d8b6b27b0e4636d9899f7';
      const return1 = privateKeyToAddress(this.privateKey);
      const return2 = privateKeyToAddress(DIFFERENT_PRIVATE_KEY);
      return1.should.not.equal(return2);
    });
  });
});
