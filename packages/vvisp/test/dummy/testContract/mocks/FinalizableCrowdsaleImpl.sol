pragma solidity ^0.4.23;

import "../sales/FinalizableCrowdsale.sol";
import "../tokens/MintableToken.sol";


contract FinalizableCrowdsaleImpl is FinalizableCrowdsale {

    function FinalizableCrowdsaleImpl (
        uint256 _openingTime,
        uint256 _closingTime,
        uint256 _rate,
        address _wallet,
        MintableToken _token
    )
    public
    Crowdsale(_rate, _wallet, _token)
    TimedCrowdsale(_openingTime, _closingTime)
    {
    }

}
