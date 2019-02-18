const { BN } = require('openzeppelin-test-helpers');

const Contract = artifacts.require('Contract');

contract('Contract', accounts => {
  const [owner] = accounts;

  beforeEach(async function() {
    this.contract = await Contract.new({ from: owner });
  });
  it('should be a example test', async function() {
    await this.contract.exampleFunction();
  });
});
