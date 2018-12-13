const chai = require('chai');
chai.should();

const { privateKeyToAddress, mnemonicToPrivateKey } = require('../src');

const MNEMONIC =
  'away clutch still element short tooth spy hood army split stomach sail';

describe('# privateKeyToAddress test', function() {
  before(function() {
    this.privateKey = mnemonicToPrivateKey(MNEMONIC);
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
    it('should return different outputs with different inputs', function() {
      const MNEMONIC2 =
        'away clutch still element short sail spy hood army split stomach sail';
      const return1 = privateKeyToAddress(this.privateKey);
      const return2 = privateKeyToAddress(mnemonicToPrivateKey(MNEMONIC2));
      return1.should.not.equal(return2);
    });
  });
});
