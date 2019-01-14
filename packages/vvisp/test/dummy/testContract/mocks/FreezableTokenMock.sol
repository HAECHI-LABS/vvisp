pragma solidity ^0.4.23;

import "../tokens/FreezableToken.sol";


contract FreezableTokenMock is FreezableToken {

    constructor(address[] initialAccounts, uint256[] initialBalances) public {
        for (uint256 i = 0; i < initialAccounts.length; i++) {
            balances[initialAccounts[i]] = initialBalances[i];
        }
    }
}
