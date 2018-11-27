pragma solidity ^0.4.23;

contract SecondD {
    address addressB;
    address owner;

    constructor(address _addressB, address _owner) public {
        addressB = _addressB;
        owner = _owner;
    }
}
