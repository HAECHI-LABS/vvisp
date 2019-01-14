pragma solidity ^0.4.23;

import "./Crowdsale.sol";
import "../utils/SafeMath.sol";


/**
 * @title IndividualMinMaxCrowdsale
 */
contract IndividualMinMaxCrowdsale is Crowdsale {
    using SafeMath for uint256;

    mapping(address => uint256) public contributions;
    uint256 public min;
    uint256 public max;

    constructor(uint256 _min, uint256 _max) public {
        require(_min > 0);
        require(_max > 0);
        require(_max >= _min);

        min = _min;
        max = _max;
    }

    /**
     * @dev Extend parent behavior requiring purchase to respect the user's funding cap.
     * @param _beneficiary Token purchaser
     * @param _weiAmount Amount of wei contributed
     */
    function _preValidatePurchase(address _beneficiary, uint256 _weiAmount) internal {
        super._preValidatePurchase(_beneficiary, _weiAmount);
        require(contributions[_beneficiary].add(_weiAmount) >= min);
        require(contributions[_beneficiary].add(_weiAmount) <= max);
    }

    /**
     * @dev Extend parent behavior to update user contributions
     * @param _beneficiary Token purchaser
     * @param _weiAmount Amount of wei contributed
     */
    function _updatePurchasingState(address _beneficiary, uint256 _weiAmount) internal {
        super._updatePurchasingState(_beneficiary, _weiAmount);
        contributions[_beneficiary] = contributions[_beneficiary].add(_weiAmount);
    }
}
