const BigNumber = web3.BigNumber;
require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

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
