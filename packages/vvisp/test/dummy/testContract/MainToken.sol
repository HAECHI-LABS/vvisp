pragma solidity ^0.4.23;


import "./tokens/FreezableToken.sol";
import "./tokens/TransferableToken.sol";
import "./tokens/PausableToken.sol";
import "./tokens/MintableToken.sol";
import "./tokens/BurnableToken.sol";


/**
 * @title MainToken
 */
contract MainToken is FreezableToken
    , TransferableToken
    , PausableToken
    , MintableToken
    , BurnableToken
    {
    string public name;
    string public symbol;
    uint8 public decimals;

    constructor(string _name, string _symbol,
        uint8 _decimals, uint256 _initialSupply) public {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply_ = _initialSupply;
        balances[msg.sender] = _initialSupply;
        emit Transfer(0x0, msg.sender, _initialSupply);
    }
}
