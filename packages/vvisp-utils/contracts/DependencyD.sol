pragma solidity >=0.5.0 <0.6.0;


contract DependencyD {
    uint[] integers;
    address token;
    constructor(uint[] memory _integers, address _token) public {
        integers = _integers;
        token = _token;
    }

    function initialize(address _token, address _owner, address _addressA) public {
        // something
    }
}
