const chai = require('chai');
chai.use(require('chai-as-promised')).should();

const test = require('../../scripts/test');

describe('# test script test', function() {
  this.timeout(50000);

  TESTSCRIPT_PATH = './test/MetaCoinTest.js';

  it('should test a file without coverage', async function() {
    await test([TESTSCRIPT_PATH], { silent: true }).should.be.fulfilled;
  });

  it('should test all file without coverage', async function() {
    await test([], { silent: true }).should.be.fulfilled;
  });

  it('should test a file with coverage', async function() {
    await test([TESTSCRIPT_PATH], { coverage: true, silent: true }).should.be
      .fulfilled;
  });

  it('should test all file with coverage', async function() {
    await test([], { coverage: true, silent: true }).should.be.fulfilled;
  });
});
