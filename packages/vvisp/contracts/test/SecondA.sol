pragma solidity ^0.4.23;


contract SecondA {
    address addressB;
    address addressC;

    constructor(address _addressB, address _addressC, address[] _owners) public {
        addressB = _addressB;
        addressC = _addressC;
    }

    function initialize(address _token, address _owner, address[] _addressA) public {
        // something
    }
}
