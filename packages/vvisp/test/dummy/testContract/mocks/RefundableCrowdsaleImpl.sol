pragma solidity ^0.4.23;

import "../sales/RefundableCrowdsale.sol";
import "../tokens/MintableToken.sol";


contract RefundableCrowdsaleImpl is RefundableCrowdsale {

    constructor(
        uint256 _openingTime,
        uint256 _closingTime,
        uint256 _rate,
        address _wallet,
        MintableToken _token,
        uint256 _goal
    )
    public
    Crowdsale(_rate, _wallet, _token)
    TimedCrowdsale(_openingTime, _closingTime)
    RefundableCrowdsale(_goal)
    {
    }

}
