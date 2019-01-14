pragma solidity ^0.4.23;

import "./Crowdsale.sol";
import "../utils/SafeMath.sol";

/**
 * @title CappedCrowdsale
 * @dev Crowdsale with a limit for total contributions.
 */
contract CappedCrowdsale is Crowdsale {
    using SafeMath for uint256;

    uint256 public hardCap;

    /**
     * @dev Constructor, takes maximum amount of wei accepted in the crowdsale.
     * @param _hardCap Max amount of wei to be contributed
     */
    constructor(uint256 _hardCap) public {
        require(_hardCap > 0);
        hardCap = _hardCap;
    }

    /**
     * @dev Checks whether the cap has been reached.
     * @return Whether the cap was reached
     */
    function hardCapReached() public view returns (bool) {
        return weiRaised >= hardCap;
    }

    /**
     * @dev Extend parent behavior requiring purchase to respect the funding cap.
     * @param _beneficiary Token purchaser
     * @param _weiAmount Amount of wei contributed
     */
    function _preValidatePurchase(address _beneficiary, uint256 _weiAmount) internal {
        super._preValidatePurchase(_beneficiary, _weiAmount);
        require(weiRaised.add(_weiAmount) <= hardCap);
    }
}
