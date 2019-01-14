pragma solidity ^0.4.23;


import "./MainSale.sol";
import "./tokens/ERC20.sol";
import "./utils/Ownable.sol";
import "./sales/utils/Whitelist.sol";

/**
 * @title SaleManager
 * - Make Whitelist Smart Contract.
 * - Make TokenSale Smart Contract.
 */
contract SaleManager is Ownable {

    event TokenSaleCreated(address tokenSaleContractAddress);
    event WhitelistCreated(address whitelistContractAddress);

    address public whitelistAddress;
    ERC20 public token;

    constructor(ERC20 _token) public {
        require(_token != address(0));
        token = _token;
    }

    /**
    * @dev Create Whitelist smart contract
    */
    function createWhitelist() public onlyOwner returns(address) {
        whitelistAddress = address(new Whitelist());
        emit WhitelistCreated(whitelistAddress);
        return whitelistAddress;
    }

    // owner should send the token sale amount for creating token sale smart contract.
    function createTokenSale(
        address fundWallet,
        uint256 hardCap,
        uint256 rate,
        uint256 openingTime,
        uint256 closingTime,
        uint256 minEth,
        uint256 maxEth
        ) public onlyOwner returns(address) {
        require(whitelistAddress != address(0));
        require(openingTime < closingTime);
        require(minEth <= maxEth);
        MainSale sale = new MainSale(
            fundWallet,
            hardCap,
            0,
            rate,
            openingTime,
            closingTime,
            minEth,
            maxEth,
            token
        );
        emit TokenSaleCreated(address(sale));

        sale.setWhitelist(whitelistAddress);
        token.transfer(address(sale), hardCap);
        return address(sale);
    }
}
