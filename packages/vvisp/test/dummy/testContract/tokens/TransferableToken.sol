pragma solidity ^0.4.23;

import "../utils/Ownable.sol";
import "./StandardToken.sol";


/**
 * @title TransferableToken
 */
contract TransferableToken is StandardToken, Ownable {
    bool public isLock;

    mapping (address => bool) public transferableAddresses;

    constructor() public {
        isLock = true;
        transferableAddresses[msg.sender] = true;
    }

    event Unlock();
    event TransferableAddressAdded(address indexed addr);
    event TransferableAddressRemoved(address indexed addr);

    function unlock() public onlyOwner {
        isLock = false;
        emit Unlock();
    }

    function isTransferable(address addr) public view returns(bool) {
        return !isLock || transferableAddresses[addr];
    }

    function addTransferableAddresses(address[] addrs) public onlyOwner returns(bool success) {
        for (uint256 i = 0; i < addrs.length; i++) {
            if (addTransferableAddress(addrs[i])) {
                success = true;
            }
        }
    }

    function addTransferableAddress(address addr) public onlyOwner returns(bool success) {
        if (!transferableAddresses[addr]) {
            transferableAddresses[addr] = true;
            emit TransferableAddressAdded(addr);
            success = true;
        }
    }

    function removeTransferableAddresses(address[] addrs) public onlyOwner returns(bool success) {
        for (uint256 i = 0; i < addrs.length; i++) {
            if (removeTransferableAddress(addrs[i])) {
                success = true;
            }
        }
    }

    function removeTransferableAddress(address addr) public onlyOwner returns(bool success) {
        if (transferableAddresses[addr]) {
            transferableAddresses[addr] = false;
            emit TransferableAddressRemoved(addr);
            success = true;
        }
    }

    /**
    */
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
        require(isTransferable(_from));
        return super.transferFrom(_from, _to, _value);
    }

    /**
    */
    function transfer(address _to, uint256 _value) public returns (bool) {
        require(isTransferable(msg.sender));
        return super.transfer(_to, _value);
    }
}
