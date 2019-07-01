const { BN, shouldFail, constants } = require('openzeppelin-test-helpers');

const ContractFactory = artifacts.require('MetaCoin');

contract('MetaCoin', accounts => {
  const [owner] = accounts;

  let Contract;

  beforeEach(async () => {
    Contract = await ContractFactory.new({ from: owner });
  });

  describe('#constructor()', () => {
    it('should put 10000 MetaCoin in the first account', async () => {
      const balance = await Contract.getBalance.call(accounts[0]);
      assert.equal(
        balance.valueOf(),
        10000,
        "10000 wasn't in the first account"
      );
    });
  });

  describe('#sendCoin()', () => {
    it('should send coin correctly', async () => {
      // Get initial balances of first and second account.
      const account_one = accounts[0];
      const account_two = accounts[1];

      let account_one_starting_balance;
      let account_two_starting_balance;
      let account_one_ending_balance;
      let account_two_ending_balance;

      const amount = 10;

      let balance = await Contract.getBalance.call(account_one);
      account_one_starting_balance = parseInt(balance);

      balance = await Contract.getBalance.call(account_two);
      account_two_starting_balance = parseInt(balance);

      await Contract.sendCoin(account_two, amount, { from: account_one });

      balance = await Contract.getBalance.call(account_one);
      account_one_ending_balance = parseInt(balance);

      balance = await Contract.getBalance.call(account_two);
      account_two_ending_balance = parseInt(balance);

      assert.equal(
        account_one_ending_balance,
        account_one_starting_balance - amount,
        "Amount wasn't correctly taken from the sender"
      );
      assert.equal(
        account_two_ending_balance,
        account_two_starting_balance + amount,
        "Amount wasn't correctly sent to the receiver"
      );
    });
  });
});
