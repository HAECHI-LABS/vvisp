const { BN, shouldFail, constants } = require('openzeppelin-test-helpers');

const ContractFactory = artifacts.require('Contract');

contract('Contract', accounts => {
  const [owner] = accounts;

  let Contract;

  beforeEach(async () => {
    Contract = await ContractFactory.new({ from: owner });
  });

  describe('#exampleFunction()', () => {
    it('should be a example test', async () => {
      await Contract.exampleFunction();
    });
  });
});
