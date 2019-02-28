pragma solidity >=0.5.0 <0.6.0;


contract DependencyB {
    address addressD;
    address owner;

    constructor(address _addressD, address _owner) public {
        addressD = _addressD;
        owner = _owner;
    }
}
