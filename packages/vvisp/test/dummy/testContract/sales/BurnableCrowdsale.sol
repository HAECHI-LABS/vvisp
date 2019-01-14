pragma solidity ^0.4.23;

import "../utils/SafeMath.sol";
import "./RefundableCrowdsale.sol";
import "../tokens/BurnableToken.sol";

/**
 * @title BurnableCrowdsale
 * @dev Burn the remain tokens, when the token sale close and the hard cap is not reached.
 */
contract BurnableCrowdsale is RefundableCrowdsale {
    using SafeMath for uint256;

    /**
     * @dev burn the remain token, when the owner call the finalize()
     */
    function finalization() internal {
        BurnableToken burnableToken = BurnableToken(token);
        burnableToken.burn(burnableToken.balanceOf(this));

        super.finalization();
    }
}
