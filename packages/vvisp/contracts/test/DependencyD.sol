pragma solidity ^0.4.23;

contract DependencyD {
    address token;
    constructor(address _token) public {
        token = _token;
    }

    function initialize(address _token, address _owner, address _addressA) public {
        // something
    }
}
