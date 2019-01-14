pragma solidity ^0.4.23;

import "../utils/Ownable.sol";
import "./StandardToken.sol";


/**
 * @title FreezableToken
 * @dev Freeze transfer of the specific addresses, if the address is hacked
 */
contract FreezableToken is StandardToken, Ownable {
    mapping (address => bool) public freezeAddresses;

    event FreezableAddressAdded(address indexed addr);
    event FreezableAddressRemoved(address indexed addr);

    function addFreezableAddresses(address[] addrs) public onlyOwner returns(bool success) {
        for (uint256 i = 0; i < addrs.length; i++) {
            if (addFreezableAddress(addrs[i])) {
                success = true;
            }
        }
    }

    function addFreezableAddress(address addr) public onlyOwner returns(bool success) {
        if (!freezeAddresses[addr]) {
            freezeAddresses[addr] = true;
            emit FreezableAddressAdded(addr);
            success = true;
        }
    }

    function removeFreezableAddresses(address[] addrs) public onlyOwner returns(bool success) {
        for (uint256 i = 0; i < addrs.length; i++) {
            if (removeFreezableAddress(addrs[i])) {
                success = true;
            }
        }
    }

    function removeFreezableAddress(address addr) public onlyOwner returns(bool success) {
        if (freezeAddresses[addr]) {
            freezeAddresses[addr] = false;
            emit FreezableAddressRemoved(addr);
            success = true;
        }
    }

    /**
    */
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
        require(!freezeAddresses[_from]);
        require(!freezeAddresses[_to]);
        return super.transferFrom(_from, _to, _value);
    }

    /**
    */
    function transfer(address _to, uint256 _value) public returns (bool) {
        require(!freezeAddresses[msg.sender]);
        require(!freezeAddresses[_to]);
        return super.transfer(_to, _value);
    }
}
