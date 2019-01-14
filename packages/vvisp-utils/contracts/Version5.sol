pragma solidity ^0.5.1;


contract DependencyA {
    address addressB;
    address addressC;
    address owner;

    constructor(address _addressB, address _addressC, address _owner) public {
        addressB = _addressB;
        addressC = _addressC;
        owner = _owner;
    }
}
