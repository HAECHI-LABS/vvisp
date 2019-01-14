pragma solidity ^0.4.23;


import "./tokens/ERC20.sol";
import "./sales/utils/Whitelist.sol";
import "./sales/CappedCrowdsale.sol";
import "./sales/IndividualMinMaxCrowdsale.sol";
import "./sales/BurnableCrowdsale.sol";


/**
 * @title MainSale
 */
contract MainSale is CappedCrowdsale
    , IndividualMinMaxCrowdsale
    , BurnableCrowdsale
    {
    Whitelist public whitelist;
    event SetWhitelistAddress(address whitelistAddress);

    constructor(
        address _wallet,
        uint256 _hardCap,
        uint256 _softCap,
        uint256 _rate,
        uint256 _openingTime,
        uint256 _closingTime,
        uint256 _min,
        uint256 _max,
        ERC20 _token
    )
    public
    Crowdsale(_rate, _wallet, _token)
    CappedCrowdsale(_hardCap)
    IndividualMinMaxCrowdsale(_min, _max)
    TimedCrowdsale(_openingTime, _closingTime)
    RefundableCrowdsale(_softCap)
    {

    }

    function setWhitelist(address _whitelist) public onlyOwner returns(bool) {
        require(_whitelist != address(0));
        whitelist = Whitelist(_whitelist);
        emit SetWhitelistAddress(_whitelist);
        return true;
    }

    function isWhitelisted(address _addr) public view returns(bool) {
        require(whitelist != address(0));
        return whitelist.isWhitelisted(_addr);
    }

    // Override
    function _preValidatePurchase(address _beneficiary, uint256 _weiAmount) internal {
        super._preValidatePurchase(_beneficiary, _weiAmount);
        require(whitelist != address(0));
        require(whitelist.isWhitelisted(_beneficiary));
    }
}
