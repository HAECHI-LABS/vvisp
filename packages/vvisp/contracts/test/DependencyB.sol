pragma solidity ^0.4.23;

contract DependencyB {
    uint tmp;
    address addressD;
    address owner;

    constructor(uint _tmp, address _addressD, address _owner) public {
        tmp = _tmp;
        addressD = _addressD;
        owner = _owner;
    }
}
