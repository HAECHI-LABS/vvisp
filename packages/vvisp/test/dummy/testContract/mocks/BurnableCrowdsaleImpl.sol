pragma solidity ^0.4.23;

import "../sales/RefundableCrowdsale.sol";
import "../sales/BurnableCrowdsale.sol";


contract BurnableCrowdsaleImpl is BurnableCrowdsale {

    constructor(
        uint256 _openingTime,
        uint256 _closingTime,
        uint256 _rate,
        address _wallet,
        ERC20 _token,
        uint256 _goal
    )
    public
    Crowdsale(_rate, _wallet, _token)
    TimedCrowdsale(_openingTime, _closingTime)
    RefundableCrowdsale(_goal)
    {
    }

}
