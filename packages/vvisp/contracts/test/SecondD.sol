pragma solidity >=0.5.0 <0.6.0;


contract SecondD {
    address addressB;
    address owner;

    constructor(address _addressB, address _owner) public {
        addressB = _addressB;
        owner = _owner;
    }
}
