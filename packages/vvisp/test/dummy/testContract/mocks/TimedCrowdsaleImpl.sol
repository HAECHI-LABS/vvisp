pragma solidity ^0.4.23;

import "../sales/TimedCrowdsale.sol";
import "../tokens/ERC20.sol";


contract TimedCrowdsaleImpl is TimedCrowdsale {

    function TimedCrowdsaleImpl (
        uint256 _openingTime,
        uint256 _closingTime,
        uint256 _rate,
        address _wallet,
        ERC20 _token
    )
    public
    Crowdsale(_rate, _wallet, _token)
    TimedCrowdsale(_openingTime, _closingTime)
    {
    }

}
