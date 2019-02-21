const chai = require('chai');
const expect = chai.expect;
chai.should();

const { getPrivateKey } = require('../src');

const MNEMONIC =
  'away clutch still element short tooth spy hood army split stomach sail';

describe('# getPrivateKey test', function() {
  describe('# input arguments', function() {
    describe('mnemonic', function() {
      it('should reject when mnemonic is not string', function() {
        expect(() => getPrivateKey(undefined)).to.throw(TypeError);
        expect(() => getPrivateKey(null)).to.throw(TypeError);
        expect(() => getPrivateKey(123)).to.throw(TypeError);
        expect(() => getPrivateKey({ a: 1 })).to.throw(TypeError);
        expect(() => getPrivateKey(['hello', 'there'])).to.throw(TypeError);
      });

      it('should receive one word', function() {
        expect(() => getPrivateKey('hello')).to.not.throw();
      });
    });

    it('should reject with invalid type: JSON or array', function() {
      expect(() => getPrivateKey(MNEMONIC, { a: 1 })).to.throw(TypeError);
      expect(() => getPrivateKey(MNEMONIC, ['hello', 'there'])).to.throw(
        TypeError
      );
    });

    it('should success getPrivateKey with number or number string', function() {
      expect(() => getPrivateKey(MNEMONIC, '123')).to.not.throw();
      expect(() => getPrivateKey(MNEMONIC, 123)).to.not.throw();
    });

    it('should set 0 when index is undefined or null', function() {
      const nullIndex = getPrivateKey(MNEMONIC, null);
      const undefinedIndex = getPrivateKey(MNEMONIC, undefined);
      const noIndex = getPrivateKey(MNEMONIC);
      const normalIndex = getPrivateKey(MNEMONIC, 0);
      nullIndex.should.equal(normalIndex);
      undefinedIndex.should.equal(normalIndex);
      noIndex.should.equal(normalIndex);
    });
  });

  describe('# return value', function() {
    it('should be a string', function() {
      const result = getPrivateKey(MNEMONIC);
      result.should.a('string');
    });

    it('should have 64 length', function() {
      const result = getPrivateKey(MNEMONIC);
      result.should.have.lengthOf(64);
    });

    it('should be different when indexes are different', function() {
      const result0 = getPrivateKey(MNEMONIC, 0);
      const result1 = getPrivateKey(MNEMONIC, 1);
      result0.should.not.equal(result1);
    });

    it('should be same with string index and number index', function() {
      getPrivateKey(MNEMONIC, '123').should.be.equal(
        getPrivateKey(MNEMONIC, 123)
      );
    });
  });

  describe('private key enable', function() {
    const privateKey = process.env.PRIVATE_KEY;
    before(function() {
      process.env.PRIVATE_KEY =
        '9741fa712a6912b862c9043f8752ffae513cb01895985998c61620da5aaf2d2d';
    });

    after(function() {
      process.env.PRIVATE_KEY = privateKey;
      if (
        typeof process.env.PRIVATE_KEY === 'string' &&
        process.env.PRIVATE_KEY.length === 0
      )
        delete process.env.PRIVATE_KEY;
    });

    it('should pass when private key given', function() {
      const result = getPrivateKey();
      result.should.equal(process.env.PRIVATE_KEY);
    });

    it('should return private key instead of mnemonic', function() {
      const result = getPrivateKey(MNEMONIC, 3);
      result.should.equal(process.env.PRIVATE_KEY);
    });
  });
});
