pragma solidity ^0.4.23;

import "../sales/CappedCrowdsale.sol";
import "../tokens/ERC20.sol";

contract CappedCrowdsaleImpl is CappedCrowdsale {

    function CappedCrowdsaleImpl (
        uint256 _rate,
        address _wallet,
        ERC20 _token,
        uint256 _cap
    )
    public
    Crowdsale(_rate, _wallet, _token)
    CappedCrowdsale(_cap)
    {
    }

}
