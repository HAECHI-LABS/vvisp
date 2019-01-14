pragma solidity ^0.4.23;

import "../tokens/BurnableToken.sol";


contract BurnableTokenMock is BurnableToken {

    function BurnableTokenMock(address initialAccount, uint initialBalance) public {
        balances[initialAccount] = initialBalance;
        totalSupply_ = initialBalance;
    }

}
