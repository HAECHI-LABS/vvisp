const chai = require('chai');
chai.use(require('chai-as-promised')).should();

const compile = require('../../scripts/compile');
const path = require('path');
const fs = require('fs-extra');

describe('# compile script test', function() {
  this.timeout(50000);
  const CONTRACTS_DIR = path.join('./contracts');
  const CONTRACT_PATH1 = path.join(CONTRACTS_DIR, 'test', 'SecondA.sol');
  const CONTRACT_PATH2 = path.join(CONTRACTS_DIR, 'test', 'Attachment.sol');
  const BUILD_DIR = path.join('./build/contracts');

  afterEach(function() {
    fs.removeSync(path.join('./', 'build'));
  });

  it('should compile one contract', async function() {
    await compile([CONTRACT_PATH1], { silent: true }).should.be.fulfilled;

    fs.ensureFileSync(
      path.join(BUILD_DIR, `${path.parse(CONTRACT_PATH1).name}.json`)
    );
    fs.readdirSync(BUILD_DIR).should.have.lengthOf(1);
  });

  it('should compile two contracts', async function() {
    await compile([CONTRACT_PATH1, CONTRACT_PATH2], { silent: true }).should.be
      .fulfilled;
  });

  it('should compile all contracts', async function() {
    await compile([], { silent: true }).should.be.fulfilled;
  });

  it('should exclude file which is not solidity file', async function() {
    const dummyFilePath = path.join(CONTRACTS_DIR, 'Hello.txt');
    fs.writeFileSync(
      dummyFilePath,
      new Uint8Array(Buffer.from('Hello Node.js'))
    );
    await compile([], { silent: true }).should.be.fulfilled;
    fs.removeSync(dummyFilePath);
  });
});
