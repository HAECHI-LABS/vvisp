pragma solidity ^0.4.23;

import "../sales/IndividualMinMaxCrowdsale.sol";
import "../tokens/ERC20.sol";


contract IndividualMinMaxCrowdsaleImpl is IndividualMinMaxCrowdsale {

    constructor (
        address _wallet,
        uint256 _rate,
        uint256 _min,
        uint256 _max,
        ERC20 _token
    )
    public
    Crowdsale(_rate, _wallet, _token)
    IndividualMinMaxCrowdsale(_min, _max)
    {
    }
}
