pragma solidity ^0.4.23;


contract SecondA {
    address addressB;
    address addressC;
    address owner;

    constructor(address _addressB, address _addressC, address _owner) public {
        addressB = _addressB;
        addressC = _addressC;
        owner = _owner;
    }

    function initialize(address _token, address _owner, address _addressA) public {
        // something
    }
}
