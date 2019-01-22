const deployContract = require('../../scripts/deploy-contract');
const path = require('path');
require('dotenv').config();
describe('# deploy contract process test', function() {
  this.timeout(50000);
  const CONTRACT_PATH = path.join('./contracts', 'libs', 'Ownable.sol');
  const CONTRACT_INHERITED_PATH = path.join(
    './contracts',
    'test',
    'Attachment.sol'
  );
  const CONTRACT_FLATTENED_PATH = path.join(
    './contracts',
    'test',
    'Flattend.sol'
  );
  const DUMMMY_FILE = path.join('./test', 'dummy', 'test.env');

  it('should deploy one contract', async () => {
    await deployContract(CONTRACT_PATH, [], { silent: true }).should.be
      .fulfilled;
  });

  describe('private key', function() {
    const mnemonic = process.env.MNEMONIC;
    const privateKey = process.env.PRIVATE_KEY;
    before(function() {
      process.env.PRIVATE_KEY =
        '9741fa712a6912b862c9043f8752ffae513cb01895985998c61620da5aaf2d2d';
      delete process.env.MNEMONIC;
    });
    after(function() {
      process.env.MNEMONIC = mnemonic;
      process.env.PRIVATE_KEY = privateKey;
    });
    it('should deploy one contract through PRIVATE_KEY setting in .env', async () => {
      await deployContract(CONTRACT_PATH, [], { silent: true }).should.be
        .fulfilled;
    });
  });

  it('should deploy two contract', async () => {
    await deployContract(CONTRACT_PATH, [], { silent: true }).should.be
      .fulfilled;
    await deployContract(CONTRACT_PATH, [], { silent: true }).should.be
      .fulfilled;
  });

  it('should reject dummy file', async () => {
    await deployContract(DUMMMY_FILE, [], { silent: true }).should.be.rejected;
  });

  it('should reject when contract name and file name are different', async () => {
    await deployContract(CONTRACT_FLATTENED_PATH, [], { silent: true }).should
      .be.rejected;
  });

  it('should deploy inherited file', async () => {
    await deployContract(CONTRACT_INHERITED_PATH, ['0x0'], { silent: true })
      .should.be.fulfilled;
  });
});
