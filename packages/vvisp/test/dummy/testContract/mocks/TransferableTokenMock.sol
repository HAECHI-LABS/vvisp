pragma solidity ^0.4.23;

import "../tokens/TransferableToken.sol";


contract TransferableTokenMock is TransferableToken {

    constructor(address[] initialAccounts, uint256[] initialBalances) public {
        for (uint256 i = 0; i < initialAccounts.length; i++) {
            balances[initialAccounts[i]] = initialBalances[i];
        }
    }
}
