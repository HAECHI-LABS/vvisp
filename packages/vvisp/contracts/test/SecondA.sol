pragma solidity >=0.5.0 <0.6.0;


contract SecondA {
    address addressB;
    address addressC;

    constructor(address _addressB, address _addressC, address[] memory _owners) public {
        addressB = _addressB;
        addressC = _addressC;
    }

    function initialize(address _token, address _owner, address[] memory _addressA) public {
        // something
    }
}
