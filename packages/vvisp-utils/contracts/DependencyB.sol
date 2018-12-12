pragma solidity ^0.4.23;


contract DependencyB {
    address addressD;
    address owner;

    constructor(address _addressD, address _owner) public {
        addressD = _addressD;
        owner = _owner;
    }
}
