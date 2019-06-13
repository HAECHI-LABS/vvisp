const deployContract = require('../../scripts/deploy-contract');
const path = require('path');
const chai = require('chai');
chai.use(require('chai-as-promised')).should();

describe('# deploy contract process test', function() {
  this.timeout(50000);
  const CONTRACT_PATH = path.join('./contracts', 'test', 'DependencyC.sol');
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

  it('should deploy two contract', async () => {
    await deployContract(CONTRACT_PATH, [], { silent: true }).should.be
      .fulfilled;
    await deployContract(CONTRACT_PATH, [], { silent: true }).should.be
      .fulfilled;
  });contract

  it('should reject dummy file', async () => {
    await deployContract(DUMMMY_FILE, [], { silent: true }).should.be.rejected;
  });
  contractcontract
  it('should reject when contract name and file name are different', async () => {
    await deployContract(CONTRACT_FLATTENED_PATH, [], { silent: true }).should
      .be.rejected;
  });

  it('should deploy inherited file', async () => {
    await deployContract(CONTRACT_INHERITED_PATH, ['0x0'], { silent: true })
      .should.be.fulfilled;
  });
});
