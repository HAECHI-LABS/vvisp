const chai = require('chai');
const expect = chai.expect;
chai.should();

const { mnemonicToPrivateKey } = require('../src');

const MNEMONIC =
  'away clutch still element short tooth spy hood army split stomach sail';

describe('# mnemonicToPrivateKey test', function() {
  describe('# input arguments', function() {
    it('should reject when mnemonic is not string', function() {
      expect(() => mnemonicToPrivateKey(undefined)).to.throw(TypeError);
      expect(() => mnemonicToPrivateKey(null)).to.throw(TypeError);
      expect(() => mnemonicToPrivateKey(123)).to.throw(TypeError);
      expect(() => mnemonicToPrivateKey({ a: 1 })).to.throw(TypeError);
      expect(() => mnemonicToPrivateKey(['hello', 'there'])).to.throw(
        TypeError
      );
    });
    it('should reject when length of mnemonic is not 12', function() {
      const mnemonic11 =
        'away clutch still element short tooth spy hood army split stomach';
      const mnemonic13 =
        'away clutch still element short tooth spy hood army split stomach sail still';
      expect(() => mnemonicToPrivateKey('')).to.throw(TypeError);
      expect(() => mnemonicToPrivateKey(mnemonic11)).to.throw(TypeError);
      expect(() => mnemonicToPrivateKey(mnemonic13)).to.throw(TypeError);
    });
    it('should reject when index is not number except undefined and null', function() {
      expect(() => mnemonicToPrivateKey(MNEMONIC, '123')).to.throw(TypeError);
      expect(() => mnemonicToPrivateKey(MNEMONIC, { a: 1 })).to.throw(
        TypeError
      );
      expect(() => mnemonicToPrivateKey(MNEMONIC, ['hello', 'there'])).to.throw(
        TypeError
      );
    });
    it('should set 0 when index is undefined or null', function() {
      const nullIndex = mnemonicToPrivateKey(MNEMONIC, null);
      const undefinedIndex = mnemonicToPrivateKey(MNEMONIC, undefined);
      const noIndex = mnemonicToPrivateKey(MNEMONIC);
      const normalIndex = mnemonicToPrivateKey(MNEMONIC, 0);
      nullIndex.should.equal(normalIndex);
      undefinedIndex.should.equal(normalIndex);
      noIndex.should.equal(normalIndex);
    });
  });
  describe('# return value', function() {
    it('should be a string', function() {
      const result = mnemonicToPrivateKey(MNEMONIC);
      result.should.a('string');
    });
    it('should have 64 length', function() {
      const result = mnemonicToPrivateKey(MNEMONIC);
      result.should.have.lengthOf(64);
    });
    it('should be different when indexes are different', function() {
      const result0 = mnemonicToPrivateKey(MNEMONIC, 0);
      const result1 = mnemonicToPrivateKey(MNEMONIC, 1);
      result0.should.not.equal(result1);
    });
  });
});
