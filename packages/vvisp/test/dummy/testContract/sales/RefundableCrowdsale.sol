pragma solidity ^0.4.23;

import "./FinalizableCrowdsale.sol";
import "./utils/RefundVault.sol";
import "../utils/SafeMath.sol";

/**
 * @title RefundableCrowdsale
 * @dev Extension of Crowdsale contract that adds a funding goal, and
 * the possibility of users getting a refund if goal is not met.
 * Uses a RefundVault as the crowdsale's vault.
 */
contract RefundableCrowdsale is FinalizableCrowdsale {
    using SafeMath for uint256;

    // minimum amount of funds to be raised in weis
    uint256 public softCap;

    // refund vault used to hold funds while crowdsale is running
    RefundVault public vault;

    /**
     * @dev Constructor, creates RefundVault.
     * @param _softCap Funding goal, "0" means softCap is not exist.
     */
    constructor(uint256 _softCap) public {
        vault = new RefundVault(wallet);
        softCap = _softCap;
    }

    /**
     * @dev Investors can claim refunds here if crowdsale is unsuccessful
     */
    function claimRefund() public {
        require(isFinalized);
        require(!softCapReached());

        vault.refund(msg.sender);
    }

    /**
     * @dev Checks whether funding goal was reached.
     * @return Whether funding goal was reached
     */
    function softCapReached() public view returns (bool) {
        return weiRaised >= softCap;
    }

    /**
     * @dev vault finalization task, called when owner calls finalize()
     */
    function finalization() internal {
        if (softCapReached()) {
            vault.close();
        } else {
            vault.enableRefunds();
        }

        super.finalization();
    }

    /**
     * @dev Overrides Crowdsale fund forwarding, sending funds to vault.
     */
    function _forwardFunds() internal {
        vault.deposit.value(msg.value)(msg.sender);
    }

}
