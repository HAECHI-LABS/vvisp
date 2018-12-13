pragma solidity ^0.4.23;


contract DependencyD {
    uint[] integers;
    address token;
    constructor(uint[] _integers, address _token) public {
        integers = _integers;
        token = _token;
    }

    function initialize(address _token, address _owner, address _addressA) public {
        // something
    }
}
