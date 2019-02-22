pragma solidity >=0.5.0 <0.6.0;


contract SecondC {
    address addressB;
    address addressC;
    address owner;

    constructor(address _addressB, address _addressC, address _owner) public {
        addressB = _addressB;
        addressC = _addressC;
        owner = _owner;
    }
}
